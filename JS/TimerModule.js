/*		Timer JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/25/2012
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
			var extensions = module['ExtensionsModule'];
			var exceptions = module['ExceptionModule'];
			factory(target, extensions, exceptions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExtensionsModule', 'ExceptionModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['Timer'] = {},
				window['ExtensionsModule'],
				window['ExceptionModule']);
		}
	})(function(TimerExports, Extensions, Exceptions)
	{
		var Timer = typeof TimerExports !== Types.Undefined ? TimerExports : {};

		// Start Timer module code here
		// Any publicly accessible methods should be attached to the "Timer" object created above
		// Any private functions or variables can be placed anywhere

		Timer.StopWatch = (function(undefined){
			// Dependencies
		
			// Private Variables
		
			// Private Static Methods
			var Start = function()
			{
				throw new Exceptions.NotImplementedException("Start not implemented");
			}

			var Stop = function()
			{
				throw new Exceptions.NotImplementedException("Stop not implemented");
			}

			var Lap = function()
			{
				throw new Exceptions.NotImplementedException("Lap not implemented");
			}
		
			// Init stuff
		
			// public API -- Methods
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var StopWatch = function(data)
			{
				var self = this;
				self.Start = Start.bind(self);
				self.Stop = Stop.bind(self);
				self.Lap = Lap.bind(self);
			}
		
			StopWatch.prototype.version = '1.0'
		
			// Return Constructor
			return StopWatch;
		})();
		

		return Timer;
	});
})();