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
			var DataObj = require('DataContext');
			var models = require('Models/JeopardyModels');
			var exceptions = require('Modules/ExceptionModule');
			var extensions = require('Modules/ExtensionsModule');
			var eventor = require('Modules/EventAggregatorModule');
			var timer = require('Modules/TimerModule');
			factory(target, DataObj, models, exceptions, extensions, eventor, timer);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'DataContext', 'Models/JeopardyModels', 'Modules/ExceptionModule', 'Modules/ExtensionsModule',
				'Modules/EventAggregatorModule', 'Modules/TimerModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['JeopardyGame'] = window['JeopardyGame'] || {},
					window['DataContext'],
					window['JeopardyModels'],
					window['ExceptionModule'],
					window['ExtensionsModule'],
					window['EventAggregatorModule'],
					window['TimerModule']);
		}
	})(function(JeopardyGameExports, DataObj, Models, Exceptions, Extensions, EventAggregator, Timer)
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
					dataContext = new DataObj.DataContext(),
					eventor = new EventAggregator.EventAggregator(),
					timer = new Timer.StopWatch({
						Duration: args.TimerDuration || 5
					});

				var categories = [];
				Object.defineProperty(self, 'Categories', {
					get: function()
					{
						return categories;
					},
					enumerable: true,
					configurable: false
				});

				/*	Description
				 *	Params Descriptions
				 */
				function StartGame(args)
				{
					args = args || {};
					round = 0;
					self.GetNextRound({
						RequiredCategories: args.RequiredCategories
					});
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame.bind(self)
				});

				
				function GetNextRound(args)
				{
					args = args || {};
					round++;
					dataContext.GetCategories(
						{
							RequiredCategories: args.RequiredCategories
						},
						function(categoryList)
						{
							var callbackArr = [];
							for(var i = 0; i < categories.length; i++)
							{
								callbackArr[i] = false;
							}

							for(var i = 0; i < categoryList.length; i++)
							{
								var handler = (function(index, questions)
								{
									callbackArr[index] = true;
									categories[index] = new Models.JeopardyCategoryModel({
										name: categoryList[index].Name,
										questions: questions
									});
									var HasCompleted = true;
									for(var j = 0; j < callbackArr.length; j++)
									{
										HasCompleted = HasCompleted && callbackArr[j];
									}

									if(HasCompleted)
										eventor.GetEvent("NotifyQuestionsLoaded").Publish(categories);

								}).bind(self, i);

								dataContext.GetQuestions(
									{
										ID:categoryList[i].ID
									},
									handler
								);
							};
						}
					);
				}
				Object.defineProperty(self, 'GetNextRound', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetNextRound.bind(self)
				});

				/*	Description
				 *	Params Descriptions
				 */
				function QuestionSelected(question)
				{
					question.HasBeenSelected(true);
					timer.Start();
				}
				Object.defineProperty(self, 'QuestionSelected', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionSelected.bind(self)
				});

				/*	Description
				 *	Params Descriptions
				 */
				function QuestionAnswered(question, correct)
				{
					
				}
				Object.defineProperty(self, 'QuestionAnswered', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionAnswered.bind(self)
				});
			}

			return JeopardyGame;
		})();

		return Jeopardy;
	});
})();