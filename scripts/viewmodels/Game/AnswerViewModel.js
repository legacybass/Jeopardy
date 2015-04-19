import ko from 'knockout'
import { Console } from 'errorhandler'

export default class AnswerViewModel {
	constructor () {
		this.Answer = ko.observable();
		this.Console = new Console();
		this.IsAnswered = ko.observable();
		this.Console.Info("Game Loaded");
	}

	ShowAnswer (answer) {
		this.Answer(answer);
		this.IsAnswered(false);
	}

	MarkAnswered () {
		this.IsAnswered(true);
	}

	Information (message) {
		this.ShowMessage(message, 'Info');
	}

	Warn (message) {
		this.ShowMessage(message, 'Warn');
	}

	Log (message) {
		this.ShowMessage(message, 'Log');
	}

	ShowMessage(message, level) {
		if(this.Console[level])
			this.Console[level](message);
		else
			this.Console.Log(level + ": " + message);
	}
}