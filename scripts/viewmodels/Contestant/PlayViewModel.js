import ko from 'knockout';
import ErrorHandler from 'errorhandler';
import Game from 'sockets/game';
import Chat from 'sockets/chat';
import io from 'socket.io';
import { Host } from 'router';

export default class PlayViewModel {
	constructor ({ gameId, contestantId, contestantName }) {
		var url = Host() || 'http://localhost';

		var gameSocket = io(url + '/Game'),
		chatSocket = io(url + '/Chat');

		this.Status = ko.observable("Disconnected");
		this.CanBuzzIn = ko.pureComputed(() => {
			return this.Status() == "Ready";
		});
		this.Score = ko.observable(0);

		this.ChatMessages = ko.observableArray();

		this.__gameId = gameId;
		this._errorHandler = new ErrorHandler();

		this.__game = new Game({
			socket: gameSocket,
			onInformation: this.Information.bind(this),
			onError: this.Error.bind(this)
		});

		this.__chat = new Chat({
			socket: chatSocket,
			onReceive: this.Receive.bind(this)
		});

		this.__game.Join({
			name: contestantName,
			gameId: gameId,
			identifier: contestantId
		})
	}

	BuzzIn() {
		this.__game.BuzzIn({
			gameId: this.__gameId,
			playerId: this.__playerId
		})
	}

	Information ({ message, status }) {
		if(status == 'Connected') {
			if(this.Status() == 'Disconnected')
				this._errorHandler.Show({
					message: message,
					title: 'Connected',
					level: 'Success'
				});
			this.Status('Connected');
		}
		else if(status == 'Disconnected') {
			this._errorHandler.Show({
				message: 'You have been disconnected from the game: ' + message,
				title: 'Disconnected',
				level: 'Warning'
			});
			this.Status('Disconnected');
		}
		else if(status == 'Ready') {
			this.Status('Ready');
		}
		else if(status == 'Update') {
			if(message.score) {
				this.Score(message.score);
			}
		}
		else {
			this._errorHandler.Show({ message: message, level: 'Info' });
		}
	}

	Error ({ message, status }) {
		if(status == 'Connected') {
			if(this.Status() == 'Disconnected')
				this._errorHandler.Show({
					message: message,
					title: 'Connected',
					level: 'Success'
				});
			this.Status('Connected');
		}
		else if(status == 'Disconnected') {
			this._errorHandler.Show({
				message: 'You have been disconnected from the game: ' + message,
				title: 'Disconnected',
				level: 'Warning'
			});
			this.Status('Disconnected');
		}
		else if(status == 'Ready') {
			this.Status('Ready');
		}
		else {
			this._errorHandler.Show({ message: message, level: 'Error' });
		}
	}

	Receive ({ message, sender }) {

	}
}