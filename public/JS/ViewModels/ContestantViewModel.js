/*		ContestantViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/17/2012
 */

(function()
{
	"use strict";

	var Types = {
		Function: typeof function() {},
		Object: typeof {},
		String: typeof "",
		Number: typeof 1,
		Boolean: typeof false,
		Undefined: typeof undefined
	};

	(function(factory)
	{
		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var target = module['exports'] || exports;
			var exceptions = module['Modules/ExceptionModule'];
			var ko = module['knockout'];
			var extensions = module['Modules/ExtensionsModule'];
			var webSocket = module['/socket.io/socket.io.js'];

			factory(target, exceptions, ko, webSocket);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExceptionModule', 'knockout', '/socket.io/socket.io.js',
						'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['ContestantViewModel'] = window['ContestantViewModel'] || {},
					window['ExceptionModule'],
					window['ko'],
					window['Socket.io']);
		}
	})(function(ContestantViewModelExports, Exceptions, ko, io)
	{
		var ContestantViewModel = typeof ContestantViewModelExports !== Types.Undefined ? ContestantViewModelExports : {};
		
		// Start ContestantViewModel module code here
		// Any publicly accessible methods should be attached to the "ContestantViewModel" object created above
		// Any private functions or variables can be placed anywhere
		
		var colors = [
				'black',
				'white',
				'red',
				'orange',
				'yellow',
				'green',
				'blue',
				'purple'
			];

		function DisplayError(message)
		{
			console.log(message);
			alert(message);
		}

		var ViewModel = (function(undefined) {
			var ViewModel = function (data)
			{
				if(!(this instanceof ViewModel))
					return new ViewModel(data);

				data = data || {};

				var self = this
					, connecting = ko.observable(false)
					, isLoggedIn = ko.observable(false)
					, isLockedOut = false
					, socket
					, defaultPacket = { Hash: undefined, Name: undefined, Username: undefined, UserID: undefined, WNumber: undefined };

				var selectedColor = ko.observable(colors[Math.floor(Math.random() * colors.length)]);
				Object.defineProperty(self, 'SelectedColor', {
					get: function() { return selectedColor; }
					, set: function(value) { selectedColor(value); }
					, configurable: false
					, enumerable: true
				});

				var tempHost = window.location.origin || (window.location.protocol + "//" + window.location.host);
				var hostURL = ko.observable(tempHost);
				Object.defineProperty(self, 'HostURL', {
					get: function() { return hostURL; }
					, set: function(value) { hostURL(value); }
					, configurable: false
					, enumerable: true
				});

				var userName = ko.observable();
				Object.defineProperty(self, 'UserName', {
					get: function() { return userName; }
					, set: function(value) { userName(value); }
					, configurable: false
					, enumerable: true
				});

				var gameName = ko.observable();
				Object.defineProperty(self, 'GameName', {
					get: function() { return gameName; }
					, set: function(value) { gameName(value); }
					, configurable: false
					, enumerable: true
				});

				var wNumber = ko.observable();
				Object.defineProperty(self, 'WNumber', {
					get: function() { return wNumber; }
					, set: function(value) { wNumber(value); }
					, configurable: false
					, enumerable: true
				});

				var score = ko.observable(0);
				Object.defineProperty(self, 'Score', {
					get: function() { return score; },
					enumerable: true,
					configurable: false
				});

				Object.defineProperty(self, 'Colors', {
					get: function() { return colors; }
					, configurable: false
					, enumerable: true
				});
				
				Object.defineProperty(self, 'Connecting', {
					get: function() { return connecting; },
					enumerable: false,
					configurable: false
				});

				Object.defineProperty(self, 'LoggedIn', {
					get: function() { return isLoggedIn; },
					configurable: false,
					enumerable: false,
				});
				
				var canAnswer = ko.observable(false);
				Object.defineProperty(self, 'CanAnswer', {
					get: function() { return canAnswer; }
					, set: function(value) { canAnswer(value); }
					, configurable: false
					, enumerable: true
				});

				var message = ko.observable();
				Object.defineProperty(self, 'GameMessage', {
					get: function() { return message; }
					, set: function(value) { message(value); }
					, configurable: false
					, enumerable: true
				});

				var error = ko.observable();
				Object.defineProperty(self, 'Error', {
					get: function() { return error; }
					, set: function(value) { error(value); }
					, configurable: false
					, enumerable: true
				});

				var errorMessage = ko.observable();
				Object.defineProperty(self, 'ErrorMessage', {
					get: function() { return errorMessage; }
					, set: function(value) { errorMessage(value); }
					, configurable: false
					, enumerable: true
				});

				var squareBuzzer = ko.observable('false');
				Object.defineProperty(self, 'SquareBuzzer', {
					get: function() { return squareBuzzer; }
					, set: function() { squareBuzzer(value); }
					, configurable: false
					, enumerable: true
				});

				var hasAnsweredQuestion = ko.observable('false');
				Object.defineProperty(self, 'HasAnsweredQuestion', {
					get: function() { return hasAnsweredQuestion; }
					, set: function() { hasAnsweredQuestion(value); }
					, configurable: false
					, enumerable: true
				});

				function ConnectUser()
				{
					if(hostURL() && userName() && gameName() && wNumber())
					{
						connecting(true);
						socket = io.connect(hostURL());
						SetupSockets();
						defaultPacket.Username = userName();
						defaultPacket.Name = gameName();
						defaultPacket.WNumber = wNumber();
						socket.emit('Login', defaultPacket);
					}
					else
					{
						error(true);
						errorMessage("Must have a value for all fields.");
					}
				}
				Object.defineProperty(self, "ConnectUser", {
					enuemrable: false,
					configurable: false,
					writable: false,
					value: ConnectUser
				});

				var token;
				function BuzzIn()
				{
					socket.emit('BuzzIn', defaultPacket);
				}
				Object.defineProperty(self, "BuzzIn", {
					enuemrable: false,
					configurable: false,
					writable: false,
					value: BuzzIn
				});

				function SetupSockets()
				{
					socket.on("Connected", function(data)
					{
						connecting(false);
						isLoggedIn(true);
						defaultPacket.Hash = data.Hash;
					});

					socket.on("BuzzIn", function(data)
					{
						message(data.Username + " buzzed in first!");
						alert(data.Username + " buzzed in first!");
						canAnswer(false);
					});

					socket.on("QuestionSelected", function(data)
					{
						// Flash screen
						canAnswer(true);
						message("");
					});

					socket.on("QuestionAnswered", function(data)
					{
						if(data.Winner)
						{
							message(data.Winner + " got the points!");
						}
						canAnswer(false);
					});

					socket.on("ScoreUpdate", function(data)
					{
						score(data.Score);
					});

					socket.on('LockedOut', function(data)
					{
						isLockedOut = data.LockedOut;
					});

					socket.on("Error", function(data)
					{
						error(true);
						errorMessage("Error occured during " + data.Response + ".  " + data.ErrorMessage);
					});

					socket.on('EndGame', function(data)
					{
						// Perform reset
					});
				}

				var eventListener = window.addEventListener || window.attachEvent;
				eventListener('unload', function()
				{
					if(socket)
					{
						socket.emit('Disconnect', defaultPacket);
					}
				});
			}
			
			ViewModel.prototype.version = '2.0';
			return ViewModel;
		})();
		ContestantViewModel.ViewModel = ViewModel;

		return ContestantViewModel;
	});
})();