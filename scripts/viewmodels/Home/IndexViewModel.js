import ko from 'knockout';
import * as router from 'router';

export default class HomeViewModel {
	constructor () {
		if(!(this instanceof HomeViewModel))
			return new HomeViewModel();
		
		this.Title = ko.observable('Jeopardy!');
	}
}