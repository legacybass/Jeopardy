import socket from 'socket.io';

export default class Game {
	constructor ({ socket, onBuzzIn = () => { }, onInformation = () => { }, onError = () => { } }) {
		this.socket = socket;
		this._buzzInCallback = onBuzzIn;
		this._informationCallback = onInformation;
		this._errorCallback = onError;

		Object.defineProperty(this, 'Id', {
			get: () => this.socket.id,
			enumerable: true,
			configurable: false
		});

		this.InitSocket();
	}

	_Init ({ name }) {
		// Game events
		
		// General information on status. If message, show user
		this.socket.on('Information', ({ message, status }) => {
			this._informationCallback({ message: message, status: status });
		});

		this.socket.on('BuzzIn', ({ player }) => {
			this._buzzInCallback({ player: player });
		});

		// Game error. Invalid information, blank, etc.
		this.socket.on('Error', ({ message, status }) => {
			this._errorCallback({ message: message, status: status });
		});
	}

	InitSocket () {
		this.socket.on('connect', () => {

		});

		// Socket error
		this.socket.on('error', (err) => {
			this._errorCallback({ message: err, status: 'Disconnected' });
		});

		// Socket disconnected
		this.socket.on('disconnect', () => {
			this._informationCallback({ message: 'You have been disconnected from the server.', status: 'Disconnected' });
		});

		// Socket successfully reconnected
		this.socket.on('reconnect', (attempts) => {
			this._informationCallback({ message: 'You have been reconnected to the server.', status: 'Connected' });
		});

		// Socket attempting reconnection
		this.socket.on('reconnecting', (attempts) => {
			this._informationCallback({ message: 'Trying to reconnect (attempt #' + attempts + ') . . .', status: 'Disconnected' });
		});

		// Socket error while reconnecting
		this.socket.on('reconnect_error', (err) => {
			this._informationCallback({ message: err, status: 'Disconnected' });
		});

		// Socket cannot reconnect
		this.socket.on('reconnect_failed', () => {
			this._informationCallback({ message: 'Could not reconnect you to the server.', status: 'Disconnected' });
		});
	}

	Join ({ name, gameId, gameName, identifier }) {
		this._Init({ name: name });
		this.socket.emit('Join', {
			username: name,
			identifier: identifier,
			game: gameId,
			gameName: gameName
		});
	}

	Start({ name, gameId }) {
		this._Init({ name: name });
		this.socket.emit('Start', {
			name: name,
			gameId: gameId
		});
	}

	SelectQuestion ({ gameId }) {
		this.socket.emit('SelectQuestion', { gameId: gameId });
	}

	AnswerQuestion ({ gameId, response, points, gameOver = false }) {
		this.socket.emit('AnswerQuestion', {
			gameId: gameId,
			response: response,
			points: points,
			gameOver: gameOver
		});
	}

	Close () {
		this.socket.close();
	}

	BuzzIn ({ gameId, player, game }) {
		this.socket.emit('BuzzIn', {
			gameId: gameId,
			player: player,
			gameId: game
		});
	}
}