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
					onBuzzIn = () => { }, onError = () => { }, onConnectionChange = () => { }, onInformation = () => { }, userId }) {
		var url = Host() || 'http://localhost';

		var gameSocket = io(url + '/Game'),
			chatSocket = io(url + '/Chat');

		this.__game = new Game({ socket: gameSocket, onBuzzIn: this.PlayerBuzzIn.bind(this), onInformation: this.Information.bind(this),
					onError: this.Error.bind(this) });
		this.__chat = new Chat({ socket: chatSocket });
		this._selectedQuestion;
		this._userId = userId;
		this._status = 'Disconnected';

		this._timer = new Timer({ onFinish: () => {
			if(this._currentPlayer) {
				// Contestant timeout
				this._currentPlayer = undefined;
				this._timer.Start(this._question);
			}
			else {
				// Question Timeout - question over
				this.__game.AnswerQuestion({ response: false });
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
	}

	Load ({ required = [ ], userId, name }) {
		return new Promise((resolve, reject) => {
			data.CreateGame({ name: name, identifier: this.__game.Id, userid: this._userId })
			.then((identifier) => {
				if(identifier.error) {
					this._errorCallback({ message: identifier.message, status: 'Disconnected' });
				}
				else {
					this.__game.Start({ name: name, gameId: identifier });

					data.GetCategories({ required: required, userid: userId })
					.then(data => {
						// Process categories to get just the ones we want
						if(Array.isArray(data))
							resolve({ id: identifier, categories: data });
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
		this.__game.SelectQuestion();

		// Display answer on _answer window

		// Start question timeout
		this._timer.Start(this._question);
	}

	AnswerQuestion({ response }) {
		if(!this._selectedQuestion) {
			return this._errorCallback({ message: 'No question has been selected.', status: 'NoQuestion' });
		}

		this.__game.AnswerQuestion({ response: response });
		this._timer.Stop();

		if(response) {
			this._selectedQuestion = undefined;
			// TODO: Update the _answer window to indicate tha question is over
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

	Information ({ message, status = 'Disconnected'}) {
		// Show the new info in the _answer window
		console.info("Information update: %s  %s", message, status);

		if(this._status != status) {
			this._status = status;
			this._connectionChangeCallback(status);
		}
	}

	Error ({ message, status = 'Disconnected' }) {
		this._errorCallback({ message: message });

		if(this._status != status) {
			this._status = status;
			this._connectionChangeCallback(status);
		}
	}

	Close () {
		this.__game.Close();
	}
}
