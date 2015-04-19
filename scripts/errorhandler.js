import ko from 'knockout';
import toastr from 'libs/toastr.min';
import Promise from 'libs/promise';
import jQuery from 'jquery';

var defaultToastOptions = {
	'debug': true,
	'positionClass': 'toast-top-right',
	'onclick': null,
	'showDuration': 300,
	'hideDuration': 1000,
	'timeOut': 5000,
	'extendedTimeOut': 1000,
	'showEasing': 'swing',
	'hideEasing': 'linear',
	'showMethod': 'fadeIn',
	'hideMethod': 'fadeOut'
};

export default class MessageHandler {
	constructor () {
		this._Message = ko.observable();
		this._Title = ko.observable();
		this._TimerToken = undefined;
		this._IsShowing = ko.observable(false);
	}

	Show({ message = '', title = '', level = 'error' }) {
		toastr.options = defaultToastOptions;
		
		if(toastr[level])
			toastr[level](message, title);
		else
			toastr.info(message, title);
	}

	Confirm({ element, message = "Click here to confirm, or click the 'x' to this close toast and cancel", title = "Confirm Action",
				timeout = 10000 }) {
		return new Promise((resolve, reject) => {
			var isDismissed = false;

			if(element) {
				jQuery(element).popover('show');
			}
			else {
				toastr.options = {
					'positionClass': 'toast-top-right',
					'onclick': () => {
						isDismissed = true;
						resolve();
					},
					'onHidden': () => {
						if(!isDismissed) {
							reject();
						}
					},
					'showDuration': 300,
					'hideDuration': 1000,
					'timeOut': timeout,
					'extendedTimeOut': 0,
					'showEasing': 'swing',
					'hideEasing': 'linear',
					'showMethod': 'fadeIn',
					'hideMethod': 'fadeOut',
					'closeButton': true
				}

				toastr.warning(message, title);
			}
		});
	}

	Log({ message, title = "Log Message", level = 'info' }) {
		if(level === 'warning')
			console.warn('%s: %s', title, message);
		else
			console.info("%s: %s", title, message);
	}
}

export class Console {
	constructor () {
		this.Messages = ko.observableArray();
	}

	Warn (message) {
		var output = '<span class="glyphicon glyphicon-alert icon text-danger" aria-hidden="true"></span><strong>' + message + "</strong>";
		this.Messages.push(output);
	}

	Log (message) {
		var output = '<span class="glyphicon glyphicon-triangle-right icon" aria-hidden="true"></span>' + message;
		this.Messages.push(output);
	}

	Info (message) {
		var output = '<span class="glyphicon glyphicon-info-sign icon text-info"></span><em>' + message + '</em>';
		this.Messages.push(output);
	}
}
