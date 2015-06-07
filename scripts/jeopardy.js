import * as data from 'dataaccess';
import Game from 'sockets/game';
import Chat from 'sockets/chat';
import Timer from 'timer';
import { Host } from 'router';
import io from 'socket.io';
import Promise from 'libs/promise';

// var ConnectionEnum = {
// 	Connected: 1,
// 	Disconnected: 0,
//	Reconnecting: 2,
//	Ready: 3
// }

export default class Jeopardy {
	constructor ({ name, questionCount: question, contestantCount: contestant, onTimeout = () => { }, onTimerChanged = count => { },
					onBuzzIn = () => { }, onError = () => { }, onConnectionChange = () => { }, onInformation = () => { }, userId },
					onGameOver = () => { }) {
		var url = Host() || 'http://localhost';

		var gameSocket = io(url + '/Game'),
			chatSocket = io(url + '/Chat');

		this.__game = new Game({
			socket: gameSocket,
			onBuzzIn: this.PlayerBuzzIn.bind(this),
			onInformation: this.Information.bind(this),
			onError: this.Error.bind(this)
		});
		this.__chat = new Chat({ socket: chatSocket });
		this._selectedQuestion;
		this._userId = userId;

		this._timer = new Timer({
		onFinish: () => {
			if(this._currentPlayer) {
				// Contestant timeout
				this._currentPlayer = undefined;
				this._timer.Start(this._question);
				this.AnswerQuestion({ response: false });
			}
			else {
				// Question Timeout - question over
				this.AnswerQuestion({ response: false, timeout: true });
			}

			onTimeout();
		},
		onUpdate: (count) => {
			onTimerChanged(count);
		}});


		this._question = question;
		this._contestant = contestant;

		this._buzzInCallback = onBuzzIn;
		this._errorCallback = onError;
		this._connectionChangeCallback = onConnectionChange;
		this._informationCallback = onInformation;
		this._gameOverCallback = onGameOver;

		this._RemoveQuestion = function (question) {
			var category = this.__categories.filter(n => n.Questions.indexOf(question) > -1);
			if(category.length == 1) {
				category = category[0];
				var index = category.Questions.indexOf(question);
				category.Questions.splice(index, 1);
			}
		}
	}

	Load ({ required = [ ], userId, name }) {
		return new Promise((resolve, reject) => {
			data.CreateGame({ name: name, identifier: this.__game.Id, userid: this._userId })
			.then((identifier) => {
				if(identifier.error) {
					this._errorCallback({ message: identifier.message, status: 'Disconnected' });
				}
				else {
					this.__gameId = identifier.game;
					this.__game.Start({ name: name, gameId: this.__gameId });

					data.GetGameCategories({ required: required, userid: userId })
					.then(data => {
						if(Array.isArray(data)) {
							resolve({ id: this.__gameId, categories: data });
							this.__categories = data;
						}
						else
							reject({ message: 'Server returned invalid data.' });
					},
					err => {
						reject(err);
					});
				}
			},
			(err) => {
				errorHandler.Show({ message: err.message, title: 'Could not create game.' });
			});
		});
	}

	SelectQuestion ({ question }) {
		this._selectedQuestion = question;
		this.__game.SelectQuestion({ gameId: this.__gameId });

		// Start question timeout
		this._timer.Start(this._question);
	}

	AnswerQuestion({ response, timeout = false }) {
		if(!this._selectedQuestion) {
			return this._errorCallback({ message: 'No question has been selected.', status: 'NoQuestion' });
		}

		this.__game.AnswerQuestion({
			gameId: this.__gameId,
			response: response,
			points: this._selectedQuestion.Value,
			gameOver: this.IsLastQuestion()
		});
		this._timer.Stop();

		if(response || timeout) {
			this._selectedQuestion = undefined;
			this._RemoveQuestion(this._selectedQuestion);
			
			if(this.IsLastQuestion()) {
				data.GetGameStats({ game: this.__gameId })
				.then((res) => {
					this._gameOverCallback(res);
				},
				(err) => {
					this._errorCallback({ message: "Could not retrieve game stats.", error: err });
				});
			}
		}
		else {
			this._timer.Start(this._question);
		}
	}

	PlayerBuzzIn ({ player }) {
		this._buzzInCallback({ player: player });
		this._currentPlayer = player;

		// Restart timer with contestant count
		this._timer.Stop();
		this._timer.Start(this._contestant);
	}

	Information ({ message, status }) {
		// Show the new info in the _answer window
		this._informationCallback({ message: message, status: status });
		this._connectionChangeCallback({ status: status });
	}

	Error ({ message, status = 'Disconnected' }) {
		this._errorCallback({ message: message });
		this._connectionChangeCallback({ status: status });
	}

	Close () {
		this.__game.Close();
	}

	IsLastQuestion () {
		return this.__categories.reduce((aggregate, current) => aggregate + current.Questions.length, 0) <= 1;
	}
}
