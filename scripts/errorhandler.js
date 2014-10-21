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

export default class ErrorHandler {
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

	Confirm({ element, message = "Click here to confirm, or click the 'x' to this close toast and cancel", title = "Confirm Action" }) {
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
					'timeOut': 10000,
					'extendedTimeOut': 3000,
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
}
