/*		JeopardyGame JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/5/2012
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
			var DataObj = module['DataContext'];
			factory(target, DataObj);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'DataContext'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['JeopardyGame'] = window['JeopardyGame'] || {},
					window['DataContext']);
		}
	})(function(JeopardyGameExports, DataObj)
	{
		var Jeopardy = typeof JeopardyGameExports !== Types.Undefined ? JeopardyGameExports : {};

		
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
		
		// Start JeopardyGame module code here
		// Any publicly accessible methods should be attached to the "JeopardyGame" object created above
		// Any private functions or variables can be placed anywhere
		Jeopardy.JeopardyGame = (function()
		{
			var self = this,
				round = 0,
				categories = [];

			Object.defineProperty(self, 'Categories', {
				get: function()
				{
					return categories;
				},
				enumerable: true,
				writable: false.
				configurable: false
			});

			/*	Begin the game
			 *	@param {Object} args Information about game setup
			 *		Structure:	{
			  		          		RequiredCategories: Array of category names
			  		          	}
			 */
			function StartGame(args)
			{
				args = args || {};
				GetNextRound({
					RequiredCategories: args.RequiredCategories
				});
			}

			/*	Get the next round of categories
			 *	@param {Object} args Information about the next round to start
			 *		Structure:	{
			  		          		
			  		          	}
			 */
			function GetNextRound(args)
			{
				args = args || {};
				categories = DataObj.GetCategories({
					RequiredCategories: args.RequiredCategories
				});
			}

			return function(args)
			{
				args = args || {};
				var self = this;

				if(args.DataContext == undefined)
					throw new Exception.InvalidArgumentException('The DataContext must be defined.');

				DataObj = args.DataContext;

				self.StartGame = StartGame;
				self.GetNextRound = GetNextRound;
			}
		})();
	});
})();