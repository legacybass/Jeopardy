/* global Symbol */
import ko from 'knockout';
import toastr from 'libs/toastr.min';
import Promise from 'libs/promise';
import jQuery from 'jquery';

let defaultToastOptions = {
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
	'hideMethod': 'fadeOut',
	'progressBar': true,
	'preventDuplicates': true
};

export default class MessageHandler {
	constructor () {
	}

	Show({ message = '', title = '', level = 'error', timeOut }) {
		return new Promise((resolve, reject) => {
			let options = {
				onHidden: () => {
					resolve();
				}
			};
		
			if(timeOut > 0) {
				options.progressBar = true;
				options.timeOut = timeOut;
				options.extendedTimeOut = 0;
				options.tapToDismiss = false;
			}
	
			if(toastr[level])
				toastr[level](message, title, options);
			else
				toastr.info(message, title, options);
		});
	}

	Confirm({ element, message = "Click here to confirm, or click the 'x' to this close toast and cancel", title = "Confirm Action",
				timeout = 0, confirmText = "Ok", cancelText = "Cancel" }) {
		return new Promise((resolve, reject) => {
			let isDismissed = false;

			if(element) {
				jQuery(element).popover('show');
			}
			else {
				let html = `<div>${message}</div>
						<div class="form-group">
							<button type="button" class="btn btn-success btn-block">${confirmText}</button>
							<button type="button" class="btn btn-danger btn-block">${cancelText}</button>
						</div>`;
				let toast = toastr.info(html, title, {
					'toastClass': 'toast solid',
					'positionClass': 'toast-top-right',
					'showDuration': 300,
					'hideDuration': 1000,
					'timeOut': timeout,
					'extendedTimeOut': 0,
					'closeButton': false,
					'progressBar': timeout > 0,
					'tapToDismiss': false
				});

				let btns = toast.find('button');
				btns.first().on('click', () => {
					toastr.clearToast(toast);
					resolve();
				});

				btns.last().on('click', () => {
					toastr.clearToast(toast);
					reject();
				});
			}
		});
	}

	Log({ message, title = "Log Message", level = 'info' }) {
		if(level === 'warning')
			console.warn('%s: %s', title, message);
		else
			console.info("%s: %s", title, message);
	}

	get MessageTypes() {
		return {
			Error: 'error',
			Warn: 'warn',
			Success: 'success',
			Info: 'info'
		};
	}
}

let _Messages = typeof Symbol !== "undefined" ? Symbol("Messages") : "_Messages";
export class Console {
	constructor () {
	}

	Warn (message) {
		let output = '<span class="glyphicon glyphicon-alert icon text-danger" aria-hidden="true"></span><strong>' + message + "</strong>";
		this.Messages.push(output);
	}

	Log (message) {
		let output = '<span class="glyphicon glyphicon-triangle-right icon" aria-hidden="true"></span>' + message;
		this.Messages.push(output);
	}

	Info (message) {
		let output = '<span class="glyphicon glyphicon-info-sign icon text-info"></span><em>' + message + '</em>';
		this.Messages.push(output);
	}
	
	get Messages() {
		if(!this[_Messages])
			this[_Messages] = ko.observableArray();
		return this[_Messages];
	}
}
