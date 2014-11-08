
export default class Timer {
	constructor ({ onFinish = () => { }, onUpdate = () => { } }) {
		this._finish = onFinish;
		this._update = onUpdate;
		this._token = -1;
		this._count = 0;
	}

	Start (count) {
		if(count)
			this._count = count;

		var self = this;

		function Countdown() {
			--self._count;

			if(self._count > 0) {
				self._token = setTimeout(Countdown, 1000);
				self._update(self._count);
			}
			else {
				self._finish();
			}
		}

		setTimeout(Countdown, 1000);
	}

	Pause () {
		clearTimeout(this._token);
	}

	Stop () {
		this._count = 0;
		this.Pause();
	}
}

