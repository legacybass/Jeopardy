"use strict";

process.title = 'node-chat';	// This will show up in the process monitor

var webSocketServerPort = 1337;


// Module loading
var WebSocketServer = require('websocket').server;
var http = require('http');

// Global variables
var history = [],
	clients = [],
	ids = 0,
	questionReady = false,
	questionAnswered = false;

var MessageTypes = {
	Disconnect: 0,
	LogOn: 1,
	BuzzIn: 2,
	ClearBuzz: 3,
	QuestionReady: 4,
	NextQuestion: 5
}

// Helper function
function htmlEntities(str)
{
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '$quot;');
}
function JSONEntities(str)
{
	return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/, '"');
}

function stringify(obj, tabs)
{
	if(tabs == undefined)
		tabs = '';

	var rtStr = '{\n';
	for(var key in obj)
	{
		var data = obj[key];

		if(typeof data === typeof {})
		{
			rtStr += '\t' + key + ': ';
			rtStr += stringify(data, tabs + '\t\t');
		}
		else
		{
			rtStr += '\t' + key + ': ' + data + '\n';
		}
	}
	rtStr += '\n}\n';
}

function postLog(message)
{
	console.log((new Date()) + ' ' + message);
}


// create the basic server
var server = http.createServer(function(request, response)
{
	// process HTTP request here.  Since this is web sockets, we don't need to do anything here.
	if(request.url === '/clear')
	{
		questionAnswered = false;
		console.log("Question reset.");
	}
});
server.listen(webSocketServerPort, function() {
	postLog("Server is listening on port " + webSocketServerPort);
});

// create the web socket server
var wsServer = new WebSocketServer({
	httpServer: server
});



wsServer.on('request', function(request)
{
	var connection = request.accept(null, request.origin),
		index = clients.push(connection) - 1,
		username = false,
		userid = ids++,
		buzzedTime = undefined;

	postLog('Connection accepted.');


	// message received from client
	connection.on('message', function(message)
	{
		if(message.type == 'utf8')
		{
			debugger;
			var dataObj;
			try
			{
				dataObj = JSON.parse(message.utf8Data);
			}
			catch (err)
			{
				postLog('Invalid JSON sent: ' + message);
				return;
			}

			if(dataObj.type == MessageTypes.LogOn && username == false)
			{
				username = dataObj.username;
				postLog('User is known as: ' + username + ' with id ' + userid);
				connection.sendUTF(JSON.stringify({
					type:'open',
					id: userid,
					username: username
				}));
			}
			else if(dataObj.type == MessageTypes.BuzzIn)
			{
				if(!questionReady)
				{
					buzzedTime = (new Date());
				}
				else if(buzzedTime == undefined || (buzzedTime.valueOf() + 2000) > (new Date()).valueOf())
				{
					buzzedTime = undefined;
					postLog('User ' + username + ' buzzed in. ' );

					var obj = {
						time: (new Date()).getTime(),
						id: userid,
						buzzedFirst: !questionAnswered
					}

					questionAnswered = true;

					for(var i = 0; i < clients.length; i++)
					{
						clients[i].sendUTF(json);
					}
				}
			}
			else if(dataObj.type == MessageTypes.ClearBuzz)
			{
				questionAnswered = false;
			}
			else if(dataObj.type == MessageTypes.QuestionReady)
			{

			}
			else if(dataObj.type == MessageTypes.NextQuestion)
			{

			}
			else if(dataObj.type == MessageTypes.Disconnect)
			{

			}

			history.push(dataObj);
			history = history.slice(-100);
		}
	});


	// connection closed
	connection.on('close', function(connection)
	{
		// close user connection
		if(username !== false && userid !== false)
		{
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
			clients.splice(index, 1);
		}
	})
});