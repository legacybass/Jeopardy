import ko from 'knockout';
import * as loader from 'dataaccess';
import ErrorHandler from 'errorhandler';
import * as router from 'router';

export default class SetupViewModel {
	constructor({ onlineGame=true, gameName, hasRequired=false, categories=[], chosenCategories=[], userId,
						questionCounter = 10, contestantCounter = 10, maxQuestion = 120, maxContestant = 120 }) {
		if(!(this instanceof SetupViewModel))
			return new SetupViewModel();
		
		var categoriesLoaded = false;
		this._ErrorHandler = new ErrorHandler();

		this.Title = ko.observable('Jeopardy Setup');
		this.OnlineGame = ko.observable(onlineGame);
		this.GameName = ko.observable(gameName);
		this.HasRequired = ko.observable(hasRequired);
		this.Categories = ko.observableArray(categories);
		this.ChosenCategories = ko.observableArray(chosenCategories);
		this.QuestionCounter = ko.observable(questionCounter);
		this.ContestantCounter = ko.observable(contestantCounter);

		this.Loading = ko.observable(false);

		this.GameNameValid = ko.computed(() => { return !!this.GameName() && /^[a-zA-Z]+[\sa-zA-Z0-9]*$/.test(this.GameName()) && this.GameName().length > 2; });
		this.QuestionCounterValid = ko.computed(() => {
			return this.QuestionCounter() > 0 && this.QuestionCounter() < maxQuestion;
		});
		this.ContestantCounterValid = ko.computed(() => {
			return this.ContestantCounter() > 0 && this.ContestantCounter() < maxContestant;
		});

		this.HasRequired.subscribe(val => {
			if(!!val && !categoriesLoaded)
			{
				loader.GetCategories({ userid: userId }).then(
		/* success */ categories => {
						this.Categories(categories.map((n) => n.Name));
						categoriesLoaded = true;
					},
		/* failure */ error => { errorHandler.Show({ message: error, title: "Failed to load categories from database.", level: 'error' }); });
			}
		});
	}

	SetupGame () {
		if(!this.GameNameValid())
			this._ErrorHandler.Show({ title: 'Invalid Name', message: 'Please enter a valid name for your game.', level: 'error' });
		else {
			this.Loading(true);
			return true;
		}
	}

	Serialize () {
		return {
			OnlineGame: this.OnlineGame(),
			GameName: this.GameName(),
			HasRequired: this.HasRequired(),
			Categories: this.ChosenCategories()
		};
	}
}
