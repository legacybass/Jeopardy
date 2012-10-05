/*		JeopardyViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/1/2012
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
			var models = module['JeopardyModels'] || window['JeopardyModels'];
			var data = module['DataContext'] || window['DataContext'];
			var ko = module['ko'] || window['ko'];
			factory(target, models, data, ko);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'JeopardyModels', 'knockout'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['Jeopardy'] = window['Jeopardy'] || {},
					window['JeopardyModels'],
					window['DataContext'],
					window['ko']);
		}
	})(function(JeopardyExports, JeopardyGame, JeopardyData, ko)
	{
		var Jeopardy = typeof JeopardyExports !== Types.Undefined ? JeopardyExports : {};

		
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
		
		// Start JeopardyViewModel module code here
		// Any publicly accessible methods should be attached to the "JeopardyViewModel" object created above
		// Any private functions or variables can be placed anywhere

// Begin Classes

		Jeopardy.JeopardyViewModel = function()
		{
			var self = this,
				DataObj = JeopardyData,
				GameObj = new JeopardyGame.JeopardyGame({
					DataContext:
				});

			self.categories = ko.observableArray();

			self.StartRound = function()
			{

			}
		}

// End Classes
	});
})();