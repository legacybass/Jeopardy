import ko from 'knockout';
import mapping from 'knockout.mapping';
import ErrorHandler from 'errorhandler';
import jeopardy from 'jeopardy';

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
		this.Id = ko.observable();
		this.SelectedQuestion = ko.observable();

		this._contestantCount = contestantCount;
		this._contestant;

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
			onInformation: ({ message }) => {
				errorHandler.show({ message: message, title: '', level: 'info'})
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
						n.Questions.forEach(m => { m.isAnswered = ko.observable(false); });

					this.Categories.push(mapping.fromJS(n));
				});
			}
			else {
				errorHandler.Show({ message: 'An internal error occurred on the server.', title: 'Error Loading Categories' });
			}
		},
		(err) => {
			errorHandler.Log({ message: err.message, level: 'warning' });
			errorHandler.Show({ message: 'Could not load categories for this game. ' + err.message, title: 'Error Loading Categories'});
		});
	}

	SelectQuestion (question) {
		errorHandler.Log('Selected question %s', question.Question);
		this.__game.SelectQuestion({ question: question });

		// TODO: Show question timer
		// TODO: Show the selected question
		this.SelectedQuestion(question);
	}

	AnswerQuestion (isCorrect) {
		this.__game.AnswerQuestion({ response: isCorrect });

		if(isCorrect) {
			// TODO: Hide counter and question
			var question = this.SelectedQuestion();
			question.isAnswered(true);
			this.SelectedQuestion(undefined);
		}
		else {
			// TODO: Reset question counter
		}
	}

	QuestionTimeout () {
		if(this._contestant) {
			// current contestant timed out
			alert(this._contestant + " timed out.");
			// play timeout sound
		}
		else {
			// question timed out
			alert("Question timed out!");
			var question = this.SelectedQuestion();
			question.isAnswered(true);
			this.SelectedQuestion(undefined);
			// TODO: Hide counter and question, and play timeout sound
		}
	}

	UpdateTimer (count) {
		errorHandler.Log({ message: count + ' seconds left' });
		// TODO: Update timer UI
	}

	ContestantBuzzIn ({ player }) {
		errorHandler.Show({ message: player + " buzzed in!", title: 'Contestant Buzzed In' });
		errorHandler.Confirm({ message: 'Click here to indicate a correct answer. Close the toast or wait until timeout to indicate an incorrect answer.',
								title: 'Did they answer correctly?', timeout: this._contestantCount })
		.then(() => {
			this.__game.AnswerQuestion({ response: true });
		},
		() => {
			this.__game.AnswerQuestion({ response: false });
		});
		this._contestant = player;
	}

	NavigateAway () {
		this.__game.close();
	}
}