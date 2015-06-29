import ko from 'knockout';
import mapping from 'knockout.mapping';
import ErrorHandler from 'errorhandler';
import jeopardy from 'jeopardy';
import $ from 'jquery';
import bootstrap from 'bootstrap.min';

var errorHandler = new ErrorHandler();

export default class PlayViewModel {
	constructor ({ Name: name='MyGame', questionCount = 10, contestantCount = 10, ChosenCategories: categories=[], OnlineGame: online=true, Userid }) {

		if(!(this instanceof PlayViewModel))
			return new PlayViewModel();
		
		this.Title = ko.observable(name);
		this.Categories = ko.observableArray([]);
		this.Status = ko.observable('Disconnected');
		this.Loading = ko.observable(true);
		this.GameName = ko.observable(name);
		this.Id = ko.observable();	// Only used for showing the game id on the screen (for people joining)
		this.SelectedQuestion = ko.observable();

		this._contestantCount = contestantCount;
		this._questionCount = questionCount;
		this._contestant;
		this.__answerViewModel = { Information(msg) { this._messages.push(msg); }, Warn(msg) { this._warnings.push(msg); }, _messages: [], _warnings: [] };

		this.__answerWindow = window.open("/Views/Templates/Game/Answer.html", undefined, "height=800, width=800, menubar=no, status=no, titlebar=no, toolbar=no");
		this.__answerWindow.ParentViewModel = { OnReady: (vm) => {
			this.__answerViewModel._messages.forEach(vm.Information.bind(vm));
			this.__answerViewModel._warnings.forEach(vm.Warn.bind(vm));
			this.__answerViewModel = vm;
		}};

		this.__game = new jeopardy({
			name: name,
			questionCount: questionCount,
			contestantCount: contestantCount,
			onTimeout: this.QuestionTimeout.bind(this),
			onTimerChanged: (time) => { console.log("Time left in question: %s", time); },
			onBuzzIn: this.ContestantBuzzIn.bind(this),
			onError: errorHandler.Show.bind(errorHandler),
			onConnectionChange: (status) => {
				this.Status(status);
			},
			onInformation: ({ message, status }) => {
				switch(status) {
					case "Disconnected":
						this.__answerViewModel.Warn(message);
						break;
					case "Connected":
					case "Ready":
					default:
						this.__answerViewModel.Information(message);
						break;
				}
			},
			onGameOver: (stats) => {
				console.log(stats);
			},
			userId: Userid
		});
		
		this.__game.Load({ name: name, required: categories, userId: Userid }).then((data = { }) => {
			if(data.error)
			{
				errorHandler.Show({ message: data.message, title: 'Error Loading Categories' });
			}
			else if(Array.isArray(data.categories))
			{
				this.Id(data.id);
				
				data.categories.forEach(n => {
					if(Array.isArray(n.Questions))
						n.Questions.forEach(m => { m.isAnswered = ko.observable(!!m.Answered); });
					this.Categories.push(n);
				});
			}
			else {
				errorHandler.Show({ message: 'An internal error occurred on the server.', title: 'Error Loading Categories' });
			}
		},
		(err) => {
			errorHandler.Log({ message: err.message, level: errorHandler.MessageTypes.Error });
			errorHandler.Show({ message: 'Could not load categories for this game. ' + err.message, title: 'Error Loading Categories'});
		});
	}

	SelectQuestion (question) {
		errorHandler.Log('Selected question %s', question.Question);
		this.__game.SelectQuestion({ question: question });

		// TODO: Show question timer
		// TODO: Show the selected question
		this.__answerViewModel.ShowAnswer(question.Answer);
		this.SelectedQuestion(question);
		question.isAnswered(true);

		PlayViewModel.ShowTimer({ timeOut: this._questionCount })

		// TODO: Make this a knockout custom binding to eliminate having to use jQuery and the DOM directly
		this.__modal = $('.modal').modal({

		});
	}

	AnswerQuestion (isCorrect) {
		this.__game.AnswerQuestion({ response: isCorrect });

		if(isCorrect) {
			// TODO: Hide counter and question
			this.ClearQuestion();
		}
	}

	QuestionTimeout () {
		if(this._contestant) {
			// current contestant timed out
			errorHandler.Show({
				message: `${this._contestant} timed out.`,
				title: "Time Out",
				level: errorHandler.MessageTypes.Info
			});
			this._contestant = undefined;

			PlayViewModel.ShowTimer({ timeOut: this._questionCount });

			// TODO: play timeout sound
		}
		else {
			// question timed out
			errorHandler.Show({
				message: "No one buzzed in in time.",
				title: "Time Out",
				level: errorHandler.MessageTypes.Info
			})

			this.ClearQuestion();
			// TODO: Hide counter and question, and play timeout sound
		}
	}

	ClearQuestion () {
			this.__modal && this.__modal.modal('hide');
			var question = this.SelectedQuestion();
			this.__answerViewModel.MarkAnswered();
			this.SelectedQuestion(undefined);
	}

	UpdateTimer (count) {
		errorHandler.Log({ message: count + ' seconds left' });
		// TODO: Update timer UI
	}

	ContestantBuzzIn ({ player }) {
		this.__answerViewModel.Log(player + " buzzed in.");
		errorHandler.Show({
			message: `${player} buzzed in!`,
			title: 'Contestant Buzzed In',
			timeout: this._contestantCount,
			level: errorHandler.MessageTypes.Info
		});
		this.__answerViewModel.ConfirmPlayerQuestion({ name: player, timeout: this._contestantCount })
		.then(() => {
			if(this.SelectedQuestion() !== undefined)
				this.__game.AnswerQuestion({ response: true });
		},
		(err) => {
			if(err)
				console.error(err);
			if(this.SelectedQuestion() !== undefined)
				this.__game.AnswerQuestion({ response: false });
		});
		this._contestant = player;
	}

	static ShowTimer({ message = "Buzz in now", timeOut }) {
		errorHandler.Show({
			message, timeOut
		})
	}

	NavigateAway () {
		this.__game.Close();
		this.__answerWindow.close();
	}
}