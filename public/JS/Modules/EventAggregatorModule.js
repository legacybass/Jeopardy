/*		EventAggregatorModule JavaScript Module
 *		Author: Daniel Beus
 *		Date: 1/23/2013
 */

(function()
{
	/**
	 * Enumeration for comparing types.
	 * @enum {string}
	 */
	var Types = {
		Function: typeof function() {},
		Object: typeof {},
		String: typeof "",
		Number: typeof 1,
		Boolean: typeof false,
		Undefined: typeof undefined
	};

	(function(root, factory)
	{
		var dependencies = ['Modules/ExtensionsModule'];

		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var target = module['exports'] || exports;
			var args = [target];
			for(var key in dependencies)
			{
				args.push(require(dependencies[key]));
			}
			factory.apply(this, args);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			var args = ['exports'];
			for(var key in dependencies)
				args.push(dependencies[key]);

			define(args, factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			var args = [root['EventAggregator'] = {}];
			for(var key in dependencies)
				args.push(root[dependencies[key]]);

			factory.apply(this, args);
		}
	})(this, function(EventAggregatorModuleExports)
	{
		var EventAggregatorModule = typeof EventAggregatorModuleExports !== Types.Undefined ? EventAggregatorModuleExports : {};

		// Start EventAggregatorModule module code here
		// Any publicly accessible methods should be attached to the "EventAggregatorModule" object created above
		// Any private functions or variables can be placed anywhere

		var EventType = (function(undefined){
			/**
			 * EventType constructor.
			 * @constructor
			 */
			var EventType = function EventType(data)
			{
				if(!(this instanceof EventType))
					return new EventType(data);
				
				var self = this,
					subscribers = new Array();
				data = data || {};
				
				/*	Subscribe to events that are published
				 *	{Function} callback The function to call when an event is published
				 */
				function Subscribe(callback)
				{
					if(typeof callback !== Types.Function)
						throw new TypeError("Parameter is not a function.");

					subscribers.push(callback);
				}
				Object.defineProperty(self, 'Subscribe', 
				{
					enumerable: false,
					configurable: false,
					writable: false,
					value: Subscribe.bind(self)
				});

				/*	Publish an event of this type
				 *	{Array} arguments Any arguments that should be passed to the function
				 */
				function Publish()
				{
					args = arguments;
					subscribers.forEach(function(callback)
					{
						callback.apply(this, args);
					});
				}
				Object.defineProperty(self, 'Publish', 
				{
					enumerable: false,
					configurable: false,
					writable: false,
					value: Publish.bind(self)
				});
			}
		
			EventType.prototype.version = '1.0'
		
			// Return Constructor
			return EventType;
		})();

		var EventAggregator = (function(undefined){
			var singleton;
			/**
			 * EventAggregator constructor.
			 * @constructor
			 */
			var EventAggregator = function EventAggregator(data)
			{
				if(!(this instanceof EventAggregator))
					return new EventAggregator(data);

				if(singleton)
					return singleton;

				singleton = this;
				
				var self = this,
					callbacks = {};
				data = data || {};
				
				/*	Gets an object to handle the specified event type
				 */
				function GetEvent(Event)
				{
					if(callbacks[Event] == undefined)
						callbacks[Event] = new EventType();

					return callbacks[Event];
				}
				Object.defineProperty(self, 'GetEvent',
				{
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetEvent.bind(self)
				});

				/*	Get the currently available event types
				 */
				function GetEventTypes()
				{
					return Object.keys(callbacks);
				}
				Object.defineProperty(self, 'GetEventTypes',
				{
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetEventTypes.bind(self)
				});
			}
		
			EventAggregator.prototype.version = '1.0'
		
			// Return Constructor
			return EventAggregator;
		})();
		Object.defineProperty(EventAggregatorModule, 'EventAggregator',
		{
			enumerable: true,
			configurable: false,
			writable: false,
			value: EventAggregator
		});

		return EventAggregatorModule;
	});
})();