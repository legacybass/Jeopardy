/*		Exception JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/4/2012
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
			var extensions = require('Modules/ExtensionsModule');
			factory(target, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['Exception'] = window['Exception'] || {});
		}
	})(function(ExceptionExports, Extensions)
	{
		var Exception = typeof ExceptionExports !== Types.Undefined ? ExceptionExports : {};
		
		// Start Exception module code here
		// Any publicly accessible methods should be attached to the "Exception" object created above
		// Any private functions or variables can be placed anywhere

		Exception.Exception = (function(undefined)
		{
			var Exception = function (message)
			{
				var self = this;
				Object.defineProperty(self, 'message',{
					get: function()
					{
						return message;
					},
					enumerable: true,
					configurable: true
				});

				Object.defineProperty(self, 'name',{
					get: function()
					{
						return message;
					},
					enumerable: true,
					configurable: true
				});

				self.prototype.toString = function()
				{
					return message;
				}

				console.error(message);
			}

			return Exception;
		})();

		Exception.NotImplementedException = (function(undefined){
			// public API -- Constructor
			var NotImplementedException = function(message)
			{
				var self = this;
				Exception.Exception.call(self, message);
			}
		
			// Inherit from another class
			NotImplementedException.prototype = Exception.Exception.prototype; 
			NotImplementedException.prototype.version = '1.0'
		
			// Return Constructor
			return NotImplementedException;
		})();

		Exception.InvalidOperationException = (function(undefined){
			// public API -- Constructor
			var InvalidOperationException = function(message)
			{
				var self = this;
				Exception.Exception.call(self, message);
			}
		
			// Inherit from another class
			InvalidOperationException.prototype = Exception.Exception.prototype 
		
			InvalidOperationException.prototype.version = '1.0'
		
			// Return Constructor
			return InvalidOperationException;
		})();

		Exception.InvalidArgumentException = (function(undefined){
			// public API -- Constructor
			var InvalidArgumentException = function(message)
			{
				var self = this;
				Exception.Exception.call(self, message);
			}
		
			// Inherit from another class
			InvalidArgumentException.prototype = Exception.Exception.prototype; 
		
			InvalidArgumentException.prototype.version = '1.0'
		
			// Return Constructor
			return InvalidArgumentException;
		})();
	});
})();