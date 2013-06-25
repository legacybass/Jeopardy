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
			var extensions = require('Modules/ExtensionsModule');
			var exceptions = require('Modules/ExceptionModule');
			var eventor = require('Modules/EventAggregatorModule');
			factory(target, extensions, exceptions, eventor);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExtensionsModule', 'Modules/ExceptionModule',
				'Modules/EventAggregatorModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['Timer'] = {},
				window['ExtensionsModule'],
				window['ExceptionModule'],
				window['EventAggregatorModule']);
		}
	})(function(TimerExports, Extensions, Exceptions, EventAggregator)
	{
		var Timer = typeof TimerExports !== Types.Undefined ? TimerExports : {};

		// Start Timer module code here
		// Any publicly accessible methods should be attached to the "Timer" object created above
		// Any private functions or variables can be placed anywhere

		Timer.StopWatch = (function(undefined){

			var StopWatch = function(data)
			{
				if(!(this instanceof StopWatch))
					return new StopWatch(data);

				data = data || {};

				var self = this,
					eventor = new EventAggregator.EventAggregator(),
					count = data.Duration || 5,
					currentTime = count,
					isRunning = false;;

				function PassTime()
				{
					if(!isRunning)
						return;

					currentTime--;
					if(currentTime == 0)
					{
						Stop();
					}
					else
					{
						eventor.GetEvent("NotifyTimerChanged").Publish(currentTime);
						setTimeout(PassTime, 1000);
					}
				}


				function Start()
				{
					currentTime = count;
					isRunning = true;
					setTimeout(PassTime, 1000);
					eventor.GetEvent("NotifyTimerStarted").Publish(currentTime);
				}
				Object.defineProperty(self, 'Start', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Start.bind(self)
				});

				function Stop()
				{
					eventor.GetEvent("NotifyTimerExpired").Publish();
					isRunning = false;
				}
				Object.defineProperty(self, 'Stop', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Stop.bind(self)
				});

				function Lap()
				{
					throw new Exceptions.NotImplementedException("Lap not implemented");
				}
				Object.defineProperty(self, 'Lap', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Lap.bind(self)
				});

				function Pause()
				{
					isRunning = false;
				}
				Object.defineProperty(self, 'Pause', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Pause.bind(self)
				});

				function Resume()
				{
					isRunning = true;
					PassTime();
				}
				Object.defineProperty(self, 'Resume', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Resume.bind(self)
				});

				function Clear()
				{
					isRunning = false;
					currentTime = count;
				}
				Object.defineProperty(self, 'Clear', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Clear.bind(self)
				});
			}
		
			StopWatch.prototype.version = '1.0'
		
			// Return Constructor
			return StopWatch;
		})();
		

		return Timer;
	});
})();