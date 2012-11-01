/*		WebSocket JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/18/2012
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
			factory(target);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['WebSocket'] = window['WebSocket'] || {});
		}
	})(function(WebSocketExports)
	{
		var WebSocketNamespace = typeof WebSocketExports !== Types.Undefined ? WebSocketExports : {};
		
		// Start WebSocket module code here
		// Any publicly accessible methods should be attached to the "WebSocket" object created above
		// Any private functions or variables can be placed anywhere

		window.WebSocket = window.WebSocket || window.MozWebSocket


		WebSocketNamespace.Socket = (function(undefined){
			// Dependencies
		
			// Private Variables
			var placeholderFunc = function() {};

			// Private Methods
			function OnConnectionOpen(event)
			{
				this.ConnectionOpen(event);
			}

			function OnReceiveMessage(message)
			{
				this.ReceivedMessage(Parse(message.data).data);
			}

			function OnConnectionError(message)
			{
				this.ConnectionError("I've made a terrible mistake... : " + message);
			}

			function OnConnectionClose(event)
			{
				this.ConnectionClosed('Connection closed.');
			}

			function Parse(json)
			{
				try
				{
					return JSON.parse(json);
				}
				catch (err)
				{
					throw "This doesn't look like JSON: " + err;
				}
			}
		
			// Init stuff
		
			// public API -- Methods
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var Socket = function(args)
			{
				if(!window.WebSocket)
					throw "Websockets not supported.";

				var self = this,
					webSocket = new WebSocket(args.server);

				webSocket.onopen = OnConnectionOpen.bind(self);
				webSocket.onmessage = OnReceiveMessage.bind(self);
				webSocket.onerror = OnConnectionError.bind(self);
				webSocket.onclose = OnConnectionClose.bind(self);


				self.ReceivedMessage = args.ReceivedMessage;
				self.ConnectionError = args.ConnectionError;
				self.ConnectionClosed = args.ConnectionClosed;
				self.ConnectionOpen = args.ConnectionOpen;

				self.Send = function(args)
				{
					if(typeof args !== Types.String)
						args = JSON.stringify(args);
					webSocket.send(args);
				}

				return true;
			}
		
			Socket.prototype.version = '1.0'
		
			// Return Constructor
			return Socket;
		})();
		

		return WebSocketNamespace;
	});
})();