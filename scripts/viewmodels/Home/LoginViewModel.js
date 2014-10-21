import ko from 'knockout';

export default class LoginViewModel {
	constructor () {
		if(!(this instanceof LoginViewModel))
			return new LoginViewModel();

		this.Username = ko.observable();
		this.Password = ko.observable();

		this.Loading = ko.observable(false);
	}

	Submit () {
		this.Loading(true);
		return true;
	}
}