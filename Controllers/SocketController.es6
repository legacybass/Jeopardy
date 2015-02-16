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
import monitor from 'monitor.io';
import { Game } from '../Modules/DataInteraction';

var games = { };

export default function Bootstrap(server) {
	var io = socket(server);

	// io.use(monitor({
	// 	port: 8000,
	// 	localOnly: true
	// }));

	var game = io.of('/Game')
	.on('connection', socket => {
		// do socket stuff
		socket.on('Start', Start.bind(socket));
		socket.on('SelectQuestion', SelectQuestion.bind(socket));
		socket.on('AnswerQuestion', AnswerQuestion.bind(socket));

		socket.on('Join', Join.bind(socket));
		socket.on('BuzzIn', BuzzIn.bind(socket));

		socket.on('disconnect', Disconnect.bind(socket));
	});

	var chat = io.of('/Chat')
	.on('connection', socket => {

	});
}

// Game id and game name
function Start({ gameId, name }) {
	if(games[gameId])
		return this.emit('Error', { message: 'This game already exists.', status: 'Disconnected' });

	games[gameId] = { players: [ ], host: this, name: name };
	
	this.gameOptions = {
		game: games[gameId],
		gameId: gameId
	};

	this.emit('Information', { status: 'Connected', message: 'Game created in memory.' });
}

// Username is the player's game name
// Game is the game id from the database,
// Room is the game name
// Identifier is their WNumber or other identifier
function Join({ username, game, gameName: room, identifier }) {
	// Join the game room
	var socket = this;

	if(!games[game])
		return socket.emit("Error", { message: 'Game does not exist.', status: 'Disconnected' });

	if(room && username && game) {
		socket.join(room);

		socket.gameOptions = {
			username: username,
			identifier: socket.id,
			game: game
		};

		socket.to(room).emit('Information', { message: username + ' has joined the game.' });

		Game.JoinGame({ game: room, player: username, identifier: identifier, host: host })
		.then((player) => {
			socket.gameOptions.player = player;
			socket.emit('Information', { status: 'Connected' });
			games[game].players.push({ socket: socket, player: player, identifier: identifier });
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

function BuzzIn({ gameId, name, identifier }) {
	// TODO: Get the player and increment their buzz count,
	// and lock them out if buzzing in at the wrong time.
	if(games[gameId]) {
		var game = games[gameId],
			room = games[gameId].name;

		if(game.ready) {
			if(this.lockout)
				return this.emit('Information', { message: 'You are locked out.' });

			if(!game.currentPlayer) {
				game.currentPlayer = { name: name, identifier: identifier, socket: this };
				this.to(room).emit('Information', { message: name + ' buzzed in.' });
				game.host.emit('BuzzIn', { player: name });
			}

			Game.IncrementBuzzIns({ gameId: gameId, name: name, identifier: identifier })
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
					delete socket.lockoutToken;
				}
			}

			socket.lockoutToken = setTimeout(LockOut, 1000);
			this.emit('Information', { message: 'You have been locked out for buzzing in at the wrong time.' });
		}
	}
	else
		this.emit('Error', { message: 'This game does not exist.', status: 'Disconnected' });
}

function Disconnect() {
	// clean up on aisle 4

	if(this.gameOptions && this.gameOptions.gameId) {
		// Remove the game from memory, 'cause this is the host
		delete games[this.gameOptions.gameId];
	}
}

function SelectQuestion({ gameId }) {
	var game = games[gameId];

	// Game exists and this is the host
	if(!!game && this.id === game.host.id) {
		var room = game.name;
		game.ready = true;
		this.to(room).emit('Information', { message: 'Question ready.', status: 'Ready' })
	}
}

function AnswerQuestion({ gameId, response, points, gameOver = false }) {
	var game = games[gameId];

	// Game exists and this is the host
	if(game && this.id === game.host.id) {
		var room = game.name;
		game.finished = !!gameOver;
		
		var player = game.currentPlayer;

		// Last user got the question right.
		if(response) {
			if(!player)
				game.host.emit('Error', { message: 'No player was selected for answering this question.' });
			else {
				this.to(room).emit('Information', { message: player.name + ' got the question right.', status: 'Connected' });

				// Store the player to notify they are next to choose
				game.lastCorrect = player;

				Game.IncrementScore({ gameId: gameId, name: player.name, identifier: player.identifier })
				.then(() => {

				},
				err => {
					game.host.emit('Information', { message: 'Could not update score for ' + player.name });
				});
			}
			game.ready = false;
		}
		else {
			if(player) {
				// Someone buzzed in, but they got it wrong
				game.ready = true;
				this.to(room).emit('Information', { message: 'Question ready.', status: 'Ready' });	
			}
			else {
				// No one buzzed in and the response was false, so the question timed out.
				game.ready = false;
				this.to(room).emit('Information', { message: 'The question timed out.', status: 'Connected' });
			}
		}

		if(!game.finished && player)
			player.socket.emit('Information', { message: 'You select the next question.' });

		game.currentPlayer = undefined;
	}
}
