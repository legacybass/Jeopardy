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
			var exceptions = module['ExceptionModule'];
			var extensions = module['ExtensionsModule'];
			factory(target, DataObj, exceptions, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'DataContext', 'ExceptionModule', 'ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['JeopardyGame'] = window['JeopardyGame'] || {},
					window['DataContext'],
					window['ExceptionModule'],
					window['ExtensionsModule']);
		}
	})(function(JeopardyGameExports, DataObj, Exceptions, Extensions)
	{
		var Jeopardy = typeof JeopardyGameExports !== Types.Undefined ? JeopardyGameExports : {};
		
		// Start JeopardyGame module code here
		// Any publicly accessible methods should be attached to the "JeopardyGame" object created above
		// Any private functions or variables can be placed anywhere
		Jeopardy.JeopardyGame = (function()
		{
			/*	Begin the game
			 *	@param {Object} args Information about game setup
			 *		Structure:	{
			  		          		RequiredCategories: Array of category names
			  		          	}
			 */
			function StartGame(args)
			{
				args = args || {};
				this.round = 0;
				this.GetNextRound({
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
				this.categories = DataObj.GetCategories({
					RequiredCategories: args.RequiredCategories
				});
				this.round++;
			}

			var JeopardyGame = function(args)
			{
				args = args || {};
				var self = this,
					dataContext = {
						round: 0,
						categories: []
					},
					LocalStartGame = StartGame.bind(dataContext),
					LocalGetNextRound = GetNextRound.bind(dataContext);
				
				dataContext.StartGame = LocalStartGame;
				dataContext.GetNextRound = LocalGetNextRound;


				self.StartGame = LocalStartGame;
				self.GetNextRound = LocalGetNextRound;
				Object.defineProperty(self, 'Categories', {
					get: function()
					{
						return dataContext.categories;
					},
					enumerable: true,
					configurable: false
				});
			}

			return JeopardyGame;
		})();

		return Jeopardy;
	});
})();