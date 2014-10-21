import ko from 'knockout';
import ErrorHandler from 'errorhandler';
import * as dataLoader from 'dataaccess';

var errorHandler = new ErrorHandler();

export default class GameViewModel {
	constructor ({ Name: name='MyGame', ChosenCategories: categories=[], OnlineGame: online=true, Userid}) {
		if(!(this instanceof GameViewModel))
			return new GameViewModel();
		
		this.Title = ko.observable(name);
		this.Categories = ko.observableArray([]);
		
		dataLoader.GetCategories({ required: categories, userid: Userid }).then((data) => {
			if(data.error)
			{
				errorHandler.Show({ message: data.message, title: 'Error Loading Categories'});
			}
			else if(Array.isArray(data))
			{
				data.forEach(n => { this.Categories.push(n); });
			}
		},
		(err) => {
			errorHandler.Show({ message: 'Could not load categories for this game. ' + err, title: 'Error Loading Categories'});
		});
	}

	SelectQuestion (question, element) {
		console.log('Selected question %s', question.Question);
	}
}