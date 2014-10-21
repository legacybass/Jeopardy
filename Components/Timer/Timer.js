import ko from 'knockout';

export default class TimerViewModel {
	constructor ({ startTimes = { hour = 0, minute = 0, second = 0}, config = { showHour = true, showMinute = true, showSecond = true }}) {
		this.Hour = ko.observable(startTimes.hour);
		this.Minute = ko.observable(startTimes.minute);
		this.Second = ko.observable(startTimes.second);

		this.HourVisible = ko.observable(config.showHour);
		this.MinuteVisible = ko.observable(config.showMinute);
		this.SecondVisible = ko.observable(config.showSecond);

		this.__token = undefined;
		this.__counter = 0;
	}

	Start ({ length = Number.MAX_VALUE }) {
		var timerFunc = () => {
			var date = new Date();

			this.Second(6 * date.getSeconds());
			this.Minute(6 * date.getMinutes());
			this.Hours(30 * (date.getHours() % 12) + d.getMinutes() / 2);



			if(!this.__token || this.__counter > length) {
				this.__token = undefined;
				this.__counter = 0;
			}
			else
				this.__token = setTimeout(timerFunc, 1000);
		};

		this.__token = setTimeout(timerFunc, 1000);
	}

	Stop () {
		clearTimeout(this.__token);
		this.__token = undefined;
	}
}