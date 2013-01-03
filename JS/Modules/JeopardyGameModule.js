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
			var exceptions = module['Modules/ExceptionModule'];
			var extensions = module['Modules/ExtensionsModule'];
			factory(target, DataObj, exceptions, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'DataContext', 'Modules/ExceptionModule', 'Modules/ExtensionsModule'], factory);
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
			var JeopardyGame = function(args)
			{
				if(!(this instanceof JeopardyGame))
					return new JeopardyGame(args);

				args = args || {};
				var self = this,
					round = 0,
					dataContext = new DataObj.DataContext();

				var categories = [];
				Object.defineProperty(self, 'Categories', {
					get: function()
					{
						return categories;
					},
					enumerable: true,
					configurable: false
				});


				self.StartGame = (function StartGame(args, callback)
				{
					args = args || {};
					round = 0;
					self.GetNextRound({
						RequiredCategories: args.RequiredCategories
					}, callback);
				}).bind(self);

				self.GetNextRound = (function GetNextRound(args, callback)
				{
					args = args || {};
					round++;
					dataContext.GetCategories(
						{
							RequiredCategories: args.RequiredCategories
						},
						function(categoryList)
						{
							categories = categoryList;
							var callbackArr = [];
							for(var i = 0; i < categories.length; i++)
							{
								callbackArr[i] = false;
							}

							for(var i = 0; i < categories.length; i++)
							{
								var handler = (function(index, questions)
								{
									callbackArr[index] = true;
									categories[index].questions = questions;
									var HasCompleted = true;
									for(var j = 0; j < callbackArr.length; j++)
									{
										HasCompleted = HasCompleted && callbackArr[j];
									}

									if(HasCompleted)
										callback && callback(categories);

								}).bind(self, i);

								dataContext.GetQuestions(
									{
										ID:categories[i].ID
									},
									handler
								);
							};
						}
					);
				}).bind(self);
			}

			return JeopardyGame;
		})();

		return Jeopardy;
	});
})();