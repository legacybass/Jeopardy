var socketio = require('socket.io')
	, mongoose = require('mongoose')
	, gameController = require('./GameController')
	, md5 = require('../public/JS/Modules/MD5')
	, Models = require('../Models/GameModels');

global.games = {};

module.exports = function(server)
{
	var io = socketio.listen(server);
	io.sockets.on('connection', function(socket)
	{
		socket.on('NewGame', function (data) { NewGame(socket, data || {}); });
		socket.on('Login', function (data) { Login(socket, data || {}); });
		socket.on('BuzzIn', function (data) { BuzzIn(socket, data || {}); });
		socket.on('QuestionSelected', function (data) { QuestionSelected(socket, data || {}); });
		socket.on('QuestionAnswered', function (data) { QuestionAnswered(socket, data || {}); });
		socket.on('GetScores', function (data) { GetScores(socket, data || {}); });
		socket.on('Disconnect', function (data) { Disconnect(socket, data || {}); });

		socket.on('disconnect', function(data) { Disconnect(socket, data || {}); });
	});
}

// Contestant functions

function Login(socket, data)
{
	var name = data.Name
		, username = data.Username;

	if(typeof name != 'string' || !name)
		EmitError(socket, 'Game not found.', 'Login');
	else if(typeof username != 'string' || !username)
		EmitError(socket, 'No username entered.', 'Login');
	else
	{
		var hash = md5.MD5(name);
		var game = games[hash];
		if(!game)
			EmitError(socket, 'Game not found.', 'Login');
		else
		{
			var user = game.FindUserByUsername(username),
				index = -1;
			if(user === undefined || user === null)
			{
				index = game.AddUser({
					Username: username,
					Socket: socket,
					Score: 0,
					Attempts: 0,
					WNumber: data.WNumber
				});
			}
			else
			{
				// Assume the user lost connection and reconnect them
				index = game.GetUserId(user);
				user.Socket = socket;
				user.NumberOfConnections++;
			}

			socket.set('Index', index, function()
			{
				socket.emit('Connected', { UserID: index, Hash: game.Hash });
				game.Host.emit('Connected', { Username: username, WNumber: data.WNumber });
			});
		}
	}
}

function BuzzIn (socket, data)
{
	var game = games[data.Hash];
	if(!game)
	{
		EmitError(socket, 'Game not found.', 'BuzzIn');
	}
	else
	{
		socket.get('Index', function(err, index)
		{
			if(err)
				EmitError(socket, 'Error looking up index.', 'BuzzIn');
			else
			{
				var user = game.FindUserByUsername(data.Username);
				if(!user)
				{
					console.log("Somehow no user is defined! Username:", data.Username, "Index: ", index);
				}
				else if(!user.IsLockedOut && !user.HasAnswered)
				{
					user.Attempts++;

					if(!game.IsLocked)
					{
						game.IsLocked = true;
						game.LastUser = user;
						game.Host.emit('BuzzIn', { Username: user.Username, WNumber: user.WNumber });
						Broadcast(game.Users, 'BuzzIn', { Username: user.Username });
						user.HasAnswered = true;
					}
					else
					{
						socket.emit('LockedOut', { LockedOut: true });
						user.LockOut();
					}
				}
			}
		});
	}
}

function Disconnect(socket, data)
{
	var game = games[data.Hash];
	if(!game)
	{
		EmitError(socket, 'Game not found.', 'Disconnect');
	}
	else
	{
		IsHost(socket, data, function(isHost)
		{
			if(isHost)
			{
				EndGame(socket, data);
			}
			else
			{
				socket.get('Index', function(err, index)
				{
					if(err)
						EmitError(socket, 'Error looking up index', 'Disconnect');
					else
					{
						var user = game.Users[index];
						game.RemoveUser(index);
						if(user)
							game.Host.emit('Disconnected', { Username: user.Useraname, WNumber: user.WNumber });
						else
							console.warn("Something bad happened!  Index: ", index);
					}
				});
			}
		});
	}
}

// Host functions

function NewGame(socket, data)
{	
	var name = data.Name;
	if(!name)
		EmitError(socket, 'Must give the game a name.', 'NewGame');
	else
	{
		socket.set('host', true, function()
		{
			var hash = md5.MD5(name);
			games[hash] = new Models.Game({
				  Host: socket
				, Hash: hash
				, IsLocked: true
				, Name: name
			});
			socket.emit('GameCreated', { Error: false, Hash: hash });
		});
	}
}

function QuestionSelected(socket, data)
{
	IsHost(socket, data, function(isHost)
	{
		if(isHost)
		{
			var game = games[data.Hash];
			if(!game)
				EmitError(socket, 'Game not found', 'QuestionSelected');
			else
			{
				game.IsLocked = false;
				Broadcast(game.Users, 'QuestionSelected', { });
				socket.emit('QuestionSelected');
			}
		}
		else
		{
			EmitError(socket, 'You are not the host', 'QuestionSelected');
			NotifyHost(data.Username, games[data.Hash]);
		}
	});
}

function QuestionAnswered(socket, data)
{
	IsHost(socket, data, function(isHost)
	{
		if(isHost)
		{
			var game = games[data.Hash];
			if(!game)
				EmitError(socket, 'Game not found', 'QuestionAnswered');
			else
			{
				if(data.Timeout)
				{
					ResetForQuestion(game);
					Broadcast(game.Users, 'QuestionAnswered', { Timeout: true });
					socket.emit('QuestionAnswered', { Timeout: true });
				}
				else
				{
					if(data.Correct)
					{
						ClearUsers(game.Users);
						var lastUser = game.LastUser;
						if(lastUser)
						{
							lastUser.Score += data.Score;
							lastUser.Socket.emit('ScoreUpdate', {Score: lastUser.Score });
							Broadcast(game.Users, 'QuestionAnswered', { Winner: lastUser.Username });
							socket.emit('QuestionAnswered', { Winner: lastUser.Username });
						}
						else
						{
							Broadcast(game.Users, 'QuestionAnswered', {});
							socket.emit('QuestionAnswered', {});
						}
						
						ResetForQuestion(game);
					}
					else
					{
						game.LastUser = undefined;
						game.IsLocked = false;
						Broadcast(game.Users, 'QuestionSelected', { });
						socket.emit('QuestionSelected', { });
					}
				}
			}
		}
		else
		{
			EmitError(socket, 'You are not the host', 'QuestionAnswered');
			NotifyHost(data.Username, games[data.Hash]);
		}
	});
}

function GetScores(socket, data)
{
	IsHost(socket, data, function(isHost)
	{
		if(isHost)
		{
			var game = games[data.Hash];
			if(!game)
				EmitError(socket, 'Game not found.', 'GetScores');
			else
			{
				var rtUsers = GetUserScores(game.Users);
				socket.emit('GetScores', { Error: false, Users: rtUsers, Name: game.Name });
			}
		}
		else
		{
			EmitError(socket, 'You are not the host.', 'GetScores' );
			NotifyHost(data.Username, games[data.Hash]);
		}
	});
}

function EndGame(socket, data)
{
	IsHost(socket, data, function(isHost)
	{
		if(isHost)
		{
			var game = games[data.Hash];
			if(!game)
				EmitError(socket, 'Game not found.', 'EndGame');
			else
			{
				var users = game.Users;
				Broadcast(users, 'EndGame', {});
				delete games[data.Hash];
				var rtUsers = GetUserScores(users);
				socket.emit('GameClosed', { Error: false, Name: game.Name, Users: rtUsers });
				
				// Save user data into database
			}
		}
		else
		{
			EmitError(socket, 'You are not the host.', 'EndGame' );
			NotifyHost(data.Username, games[data.Hash]);
		}
	});
}

// Helper functions

function GetUserScores(users)
{
	var rtUsers = [];
	users.forEach(function(user)
	{
		rtUsers.push({ Username: user.Username, Score: user.Score, Attempts: user.Attempts,
			WNumber: user.WNumber, Connections: user.NumberOfConnections });
	});
	return rtUsers;
}

function ClearUsers(users)
{
	users.forEach(function(item)
	{
		item.HasAnswered = false;
	});
}

function ResetForQuestion(game)
{
	game.IsLocked = true;
	game.LastUser = undefined;

	game.Users.forEach(function(user)
	{
		user.Socket.emit('ScoreUpdate', { Score: user.Score });
	});
}

function IsHost(socket, data, callback)
{
	var name = data.Name;
	var hash = data.Hash;
	console.log("Game Name: ", name);
	if(typeof name != 'string' || !name || typeof hash != 'string' || !hash)
		callback(false);
	else
	{
		var game = games[hash];
		if(!game)
		{
			callback(false);
		}
		else
		{
			socket.get('host', function(err, host)
			{
				if(err)
				{
					callback(false);
				}
				else
				{
					callback(host && game.Hash == data.Hash);
				}
			});
		}
	}
}

function EmitError(socket, message, response)
{
	socket.emit('Error', { Error: true, ErrorMessage: message, Response: response });
}

function NotifyHost(username, game, event)
{
	event = event || 'Cheating';
	try
	{
		if(username && game)
		{
			game.Host.emit(event, { Username: username });
		}
	}
	catch(err)
	{
		console.log('NotifyHost error: ', err);
	}
}

function Broadcast(users, event, data)
{
	users.forEach(function(user)
	{
		try
		{
			user.Socket.emit(event, data);
		}
		catch (err)
		{
			console.log('Broadcast error: ', err);
		}
	});
}