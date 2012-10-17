/*		ContestantViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/17/2012
 */

(function()
{
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
			var exceptions = module['ExceptionModule'];
			var ko = module['knockout'];

			factory(target, exceptions, ko);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExceptionModule', 'knockout'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['ContestantViewModel'] = {},
					window['ExceptionModule'],
					window['ko']);
		}
	})(function(ContestantViewModelExports, Exceptions, ko)
	{
		var ContestantViewModel = typeof ContestantViewModelExports !== Types.Undefined ? ContestantViewModelExports : {};

		
		// Code in case the "bind" method hasn't been implemented by the browser
		if(!Function.prototype['bind'])
		{
			Function.prototype['bind'] = function(object)
			{
				var originalFunction = this,
					args = Array.prototype.slice.call(arguments),
					object = args.shift();
				return function()
				{
					return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
				}
			}
		}
		
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

		ContestantViewModel.ContestantViewModel = function(args)
		{
			var self = this,
				connected = ko.observable(false),
				webSocket,
				userID,
				userName;
			
			self.SelectedColor = ko.observable(colors[Math.floor(Math.random() * colors.length)]);
			self.Colors = colors;
			self.Connected = ko.computed(function()
				{
					return !!connected();
				});
			self.SquareBuzzer = ko.observable('false');
			self.HasAnsweredQuestion = ko.observable('false');

			function OnConnectionOpen(event)
			{
				connected(true);
			}

			function OnReceiveMessage(event)
			{

			}

			function OnConnectionClose(event)
			{
				connected(false);
			}

			self.ConnectBuzzer = function(username)
			{
				self.webSocket = new WebSocket('ws://localhost:56097/');
				webSocket = self.webSocket;

				userName = username;

				webSocket.onopen = OnConnectionOpen;
				webSocket.onmessage = OnReceiveMessage;
				webSocket.onclose = OnConnectionClose;
			}

			self.BuzzIn = function()
			{

			}
		}
	});
})();

fYwot%J3Ssg?