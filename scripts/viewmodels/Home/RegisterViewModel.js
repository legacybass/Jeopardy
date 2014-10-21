import ko from 'knockout';
import ErrorHandler from 'errorhandler';

var errorHandler = new ErrorHandler();

export default class RegisterViewModel {
	constructor () {
		this.Username = ko.observable();
		this.Password = ko.observable();
		this.Confirm = ko.observable();
		this.Valid = ko.observable();

		this.Loading = ko.observable(false);
	}

	Submit (form) {
		var valid = true;
		if(!this.Username()) {
			errorHandler.Show({ message: 'Username cannot be blank.', title: 'Invalid Username' });
			valid = false;
		}
		if(!this.Password()) {
			errorHandler.Show({ message: 'Password cannot be blank.', title: 'Invalid Password' });
			valid = false;
		}
		else if(this.Password() != this.Confirm()) {
			errorHandler.Show({ message: 'Your passwords do not match.', title: 'Password Mismatch' });
			valid = false;
		}

		this.Valid(valid);
		this.Loading(true);

		return valid;
	}
}