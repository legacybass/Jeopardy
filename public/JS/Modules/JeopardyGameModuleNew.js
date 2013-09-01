/*		JeopardyGameModule JavaScript Module
 *		Author: Daniel Beus
 *		Date: 8/24/2013
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
		var requirements = ['DataContext', 'Models/JeopardyModels', 'Modules/ExceptionModule',
							'Modules/ExtensionsModule', 'Modules/EventAggregatorModule',
							'Modules/TimerModule'];


		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var mods = [module['exports'] || exports, require('module')];
			
			for(var key in requirements)
			{
				var data = requirements[key];
				if(typeof data === Types.String)
					mods.push(require(data));
			}

			factory.apply(root, mods);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			var reqs = ['exports', 'module'].concat(requirements);
			define(reqs, factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			var mods = [root['JeopardyGameModule'] = {}, root['module']];

			for(var key in requirements)
			{
				var data = requirements[key];
				if(typeof data === Types.String)
				{
					var parts = data.split('/');
					mods.push(window[parts[parts.length - 1]]);
				}
			}

			factory.apply(root, mods);
		}
	})(this, function(JeopardyGameModuleExports, module, DataContext, Models, Exceptions, Extensions, EventAggregator, Timer)
	{
		var JeopardyGameModule = typeof JeopardyGameModuleExports !== Types.Undefined ? JeopardyGameModuleExports : {},
			moduleData = module.config().data;

		// Start JeopardyGameModule module code here
		// Any publicly accessible methods should be attached to the "JeopardyGameModule" object created above
		// Any private functions or variables can be placed anywhere

		var JeopardyGame = (function(undefined){
			/**
			 * JeopardyGame constructor.
			 * @constructor
			 */
			var JeopardyGame = function JeopardyGame(data)
			{
				if(!(this instanceof JeopardyGame))
					return new JeopardyGame(data);
				
				data = data || {};
				var self = this,
					round = 0,
					dataContext = new DataContext.DataContext(),
					eventor = new EventAggregator.EventAggregator(),
					timer = new Timer.StopWatch({
						Duration: data.TimerDuration || 5
					})
					, onTimerTickCallback
					, onTimerFinishCallback
					, timerChangedToken
					, timerFinishedToken;
								
				/**
				 *	@define {array}
				 */
				var categories = [];
				Object.defineProperty(self, 'Categories',{
					get: function()
					{
						return categories;
					},
					enumerable: true,
					configurable: true
				});

				/*	Start the Game
				 *	Params Descriptions
				 */
				function StartGame(args, callback)
				{
					args = args || {};
					round = 0;
					GetNextRound({
						RequiredCategories: args.RequiredCategories
						, callback: callback
					})
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame
				});

				/*	Get the next round
				 *	Params Descriptions
				 */
				function GetNextRound(args)
				{
					args = args || {};
					round++;

					dataContext.GetCategories(args.RequiredCategories, function(categoryList)
					{
						categoryList.forEach(function(category)
						{
							categories.push(new Models.JeopardyCategoryModel({
								name: category.Name,
								questions: category.Questions
							}));
						});

						args.callback && args.callback(categories);
					});
				}
				Object.defineProperty(self, 'GetNextRound', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetNextRound
				});

				/*	Description
				 *	Params Descriptions
				 */
				function QuestionSelected(question, OnTimerTick, OnTimerFinish)
				{
					question.HasBeenSelected(true);
					onTimerTickCallback = OnTimerTick;
					onTimerFinishCallback = OnTimerFinish;
					SetupEvents();
					timer.Start();
				}
				Object.defineProperty(self, 'QuestionSelected', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionSelected
				});

				function SetupEvents()
				{
					UnSubscribe();
					timerChangedToken = eventor.GetEvent('NotifyTimerChanged')
										.Subscribe(function (currentTime)
					{
						if(onTimerTickCallback)
							onTimerTickCallback(currentTime);
					});
					timerFinishedToken = eventor.GetEvent('NotifyTimerExpired')
										.Subscribe(function ()
					{
						if(onTimerFinishCallback)
							onTimerFinishCallback();
					});
				}

				function UnSubscribe()
				{
					if(timerChangedToken)
					{
						eventor.GetEvent('NotifyTimerChanged').Unsubscribe(timerChangedToken);
						timerChangedToken = undefined;
					}
					if(timerFinishedToken)
					{
						eventor.GetEvent('NotifyTimerExpired').Unsubscribe(timerFinishedToken);
						timerFinishedToken = undefined;
					}
				}

				/*	Description
				 *	Params Descriptions
				 */
				function QuestionAnswered(question, correct)
				{
					UnSubscribe();
					timer.Stop();
					onTimerTickCallback = undefined;
					onTimerFinishCallback = undefined;
				}
				Object.defineProperty(self, 'QuestionAnswered', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionAnswered
				});
			}
		
			JeopardyGame.prototype.version = '2.0'
		
			// Return Constructor
			return JeopardyGame;
		})();

		JeopardyGameModule.JeopardyGame = JeopardyGame;

		return JeopardyGameModule;
	});
})();