import ko from 'knockout'
import ErrorHandler from 'errorhandler'
import * as DataAccessModule from 'dataaccess'

export default class LoginViewModel {
	constructor () {
		this.ContestantNamePattern = /^[a-zA-Z]+[\\sa-zA-Z0-9]*$/;
		this.GameIdPattern = /^[a-fA-F0-9]{24}$/;

		this.ContestantName = ko.observable();
		this.ContestantId = ko.observable();
		this.GameId = ko.observable();
		this._GameExists = ko.observable();

		this.ContestantNameValid = ko.pureComputed(() => this.GameIdPattern.test(this.GameId()));
		this.GameIdValid = ko.pureComputed(() => this.ContestantNamePattern.test(this.ContestantName()));
		this.AllValid = ko.pureComputed(() => {
			return this.ContestantNameValid() && this.GameIdValid() && this._GameExists();
		});

		this._ErrorHandler = new ErrorHandler();

		this.GameId.subscribe((newValue) => {
			DataAccessModule.CheckGameExists({ gameId: newValue }).then(
			(res) => {
				var exists = res && !!res.exists;
				this._GameExists(exists);
				if(!exists)
					this._ErrorHandler.Show({
						message: "Could not find a game with that id. Please make sure it is typed in correctly.",
						title: "Could not find game",
						level: "error"
					});
			},
			(err) => {
				this._GameExists(false);
				this._ErrorHandler.Show({
					message: "Could not find a game with that id. Please make sure it is typed in correctly.",
					title: "Could not find game",
					level: "error"
				});
			});
		});
	}

	Submit () {
		if(this.AllValid()) {
			return true;
		}
		else {
			this._ErrorHandler.show({ message: 'Please enter all required data, and fix all validation errors.', title: 'Invalid Data', level: 'error' });
		}
	}
}