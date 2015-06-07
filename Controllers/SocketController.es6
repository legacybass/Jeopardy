/*	The socket controller wires up sockets to a given game.
 *	The controller currently supports two namespaces
 *		Game:
 *			The game namespace holds sockets related to playing a game.
 *			This relates to all games, not a specific game. It will
 *			join the socket to a room, that represents a specific game.
 *			The Game namespace emits the following events:
 *				Information:
 *					Used to send basic textual information like when someone joins.
 *					Has the structure { message, status }
 *				BuzzedIn:
 *					Used to communicate who has buzzed in.
 *					Has the structure { player }
 *				Error:
 *					Used to send information about an error that occurred.
 *					Has the structure { message, status }
 *			The game namespace uses the following status codes:
 *				Connected:
 *					The socket is connected to the game and is awaiting an action
 *					from the host (e.g. selecting a question).
 *				Disconnected:
 *					The socket has become disconnected from the game. The socket
 *					may still be connected, but the player is no longer in sync
 *					with the game state.
 *				Ready:
 *					The host has selected a question and the game is ready for
 *					an action.
 *		Chat:
 *			The chat namespace holds sockets related to chatting in a game.
 *
 */

import socket from 'socket.io';
import { Games } from '../Modules/DataInteraction';

var games = { };
var states = {
	Connected: 'Connected',
	Disconnected: 'Disconnected',
	Ready: 'Ready'
}

export default function Bootstrap(server) {
	var io = socket(server);

	var game = io.of('/Game')
	.on('connection', socket => {
		// do socket stuff
		socket.on('Start', Start.bind(socket));
		socket.on('SelectQuestion', SelectQuestion.bind(socket));
		socket.on('AnswerQuestion', AnswerQuestion.bind(socket));

		socket.on('Join', Join.bind(socket));
		socket.on('BuzzIn', BuzzIn.bind(socket));

		socket.on('Close', Close.bind(socket));
	});

	var chat = io.of('/Chat')
	.on('connection', socket => {
		socket.on('Join', () => { socket.emit("Error", { message: "Not implemented", status: "Disconnected" })});
		socket.on('Send', () => { socket.emit("Error", { message: "Not implemented", status: "Disconnected" })});
		socket.on('disconnect', () => { });
	});
}

// Game id and game name
function Start({ gameId, name }) {
	if(games[gameId])
		return this.emit('Error', { message: 'This game already exists.', status: 'Disconnected' });

	games[gameId] = { players: [ ], host: this, name: name };
	
	this.gameOptions = {
		game: games[gameId],
		gameId: gameId,
		host: {
			isHost: true
		}
	};

	this.join(gameId);

	this.emit('Information', { status: 'Connected', message: 'Game created in memory.' });
}

// Username is the player's game name
// Game is the game id from the database,
// Identifier is their WNumber or other identifier
function Join({ username, game, playerIdentifier }) {
	// Join the game room
	var socket = this;

	if(!games[game])
		return socket.emit("Error", { message: 'Game does not exist.', status: 'Disconnected' });

	if(username && game) {
		socket.join(game);

		socket.gameOptions = {
			username: username,
			identifier: socket.id,
			game: game
		};

		socket.to(game).emit('Information', { message: username + ' has joined the game.' });

		Games.JoinGame({ game: game, playerName: username, playerIdentifier: playerIdentifier })
		.then((player) => {
			socket.gameOptions.player = player;
			socket.emit('Information', { status: 'Connected' });
			games[game].players.push({ socket: socket, player: player, playerIdentifier: playerIdentifier });
		},
		(err) => {
			console.log(err);
			socket.emit('Error', { message: err.message, status: 'Disconnected' });
		});
	}
	else {
		socket.emit('Error', { message: 'Invalid information. Make sure you are connecting to a valid game.', status: 'Disconnected' });
	}
}

function BuzzIn() {
	// TODO: Get the player and increment their buzz count,
	// and lock them out if buzzing in at the wrong time.
	if(!this.gameOptions || !this.gameOptions.game)
		return this.emit('Error', { message: 'You are not connected to a game.', status: 'Disconnected' });

	var gameId = this.gameOptions.game,
		playerName = this.gameOptions.player.Name,
		identifier = this.gameOptions.player.Id;

	if(games[gameId]) {
		var game = games[gameId];

		if(game.ready) {
			if(this.lockout)
				return this.emit('Information', { message: 'You are currently locked out.', status: states.Connected });

			if(!game.lastBuzzedIn) {
				game.lastBuzzedIn = { name: playerName, socket: this };
				this.to(game).emit('Information', { message: playerName + ' buzzed in.' });
				game.host.emit('BuzzIn', { player: playerName });
			}

			Games.IncrementBuzzIns({ gameId: gameId, name: playerName, identifier: identifier })
			.then(() => {

			},
			(err) => {
				game.host.emit('Information', { message: 'Could not update buzz ins for ' + name });
			});
		}
		else {
			// Lock out this player for buzzing in at the wrong time
			var socket = this;
			socket.lockout = 2;

			var LockOut = () => {
				socket.lockout--;
				if(socket.lockout > 0) {
					socket.lockoutToken = setTimeout(LockOut, 1000);
				}
				else {
					delete socket.lockout;
					clearTimeout(p.socket.lockoutToken);
					delete socket.lockoutToken;
					if(game.ready) {
						socket.emit('Information', { message: 'You are no longer locked out.', status: states.Connected });
					}
				}
			}

			socket.lockoutToken = setTimeout(LockOut, 1000);
			this.emit('Information', { message: 'You have been locked out for buzzing in at the wrong time.', status: states.Connected });
		}
	}
	else
		this.emit('Error', { message: 'This game does not exist.', status: 'Disconnected' });
}

function Close() {
	// clean up on aisle 4

	if(this.gameOptions && this.gameOptions.host && this.gameOptions.host.isHost) {
		// Remove the game from memory, 'cause this is the host
		delete games[this.gameOptions.gameId];
	}
}

function SelectQuestion({ gameId }) {
	var game = games[gameId];

	// Game exists and this is the host
	if(!!game && this.id === game.host.id) {
		game.ready = true;
		this.to(gameId).emit('Information', { message: 'Question ready.', status: 'Ready' })
	}
}

function AnswerQuestion({ gameId, response, points, gameOver = false }) {
	var game = games[gameId];

	// Game exists and this is the host
	if(game && this.id === game.host.id) {
		game.finished = !!gameOver;
		
		var player = game.lastBuzzedIn;

		// Last user got the question right.
		if(response) {
			game.ready = false;

			if(!player)
				game.host.emit('Error', { message: 'No player was selected for answering this question.' });
			else {
				this.to(gameId).emit('Information', { message: player.name + ' got the question right.', status: 'Connected' });

				// Store the player to notify they are next to choose
				game.lastCorrect = player;

				// clear players so they can all answer again
				game.players.forEach(p => {
					delete p.socket.lockout;
					if(p.socket.lockoutToken) {
						clearTimeout(p.socket.lockoutToken);
						delete p.socket.lockoutToken;
					}
				});

				Games.IncrementScore({ gameId: gameId, name: player.name, identifier: player.identifier, points: points })
				.then((result) => {
					// TODO: Send update score message?
					player.socket.emit('Information', { score: result.player.Score, status: 'Update' });
				},
				err => {
					game.host.emit('Information', {
						message: 'Could not update score for ' + player.name + '. Should have received '
								+ points + ' points.'
					 });
				});
			}
		}
		else {
			if(player) {
				// Someone buzzed in, but they got it wrong
				game.ready = true;
				this.lockout = 1;
				player.socket.emit('Information', { message: 'You missed the question.', status: 'Connected' });
				this.to(gameId).emit('Information', { message: 'Question ready.', status: 'Ready' });	
			}
			else {
				// No one buzzed in and the response was false, so the question timed out.
				game.ready = false;
				this.to(gameId).emit('Information', { message: 'The question timed out.', status: 'Connected' });
			}
		}

		if(!game.finished && player)
			player.socket.emit('Information', { message: 'You select the next question.' });

		game.lastBuzzedIn = undefined;
	}
}
