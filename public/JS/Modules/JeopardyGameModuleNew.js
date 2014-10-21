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
							'Modules/TimerModule', '/socket.io/socket.io.js'];


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
	})(this, function(JeopardyGameModuleExports, module, DataContext, Models, Exceptions, Extensions, EventAggregator, Timer, io, linq)
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
					, socket
					, defaultPacket = { Hash: undefined, Name: undefined }
					, currentQuestion
					, onTimerTickCallback
					, onTimerFinishCallback
					, errorCallback
					, roundEndCallback
					, timerChangedToken
					, timerFinishedToken
					, endGameCallback
					, getScoresCallback;
								
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
				function StartGame(args, callback, onError, onRoundEnd)
				{
					args = args || {};
					round = 0;
					errorCallback = onError;
					roundEndCallback = onRoundEnd;
					defaultPacket.Name = args.Name || (new Date()).toLocaleString();
					

					if(args.IsOnlineGame)
					{
						socket = io.connect(args.OnlineUrl);
						SetupSockets();
						
						socket.emit('NewGame', defaultPacket);
						socket.on('GameCreated', function(data)
						{
							defaultPacket.Hash = data.Hash;
							GetNextRound({
								RequiredCategories: args.RequiredCategories
								, callback: callback
							});
						});
					}
					else
					{
						GetNextRound({
							RequiredCategories: args.RequiredCategories
							, callback: callback
						});
					}
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame
				});

				function EndGame(callback)
				{
					if(socket)
					{
						endGameCallback = callback;
						socket.emit('EndGame', defaultPacket);
					}
					else callback();
				}
				Object.defineProperty(self, 'EndGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: EndGame
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
					currentQuestion = question;
					question.HasBeenSelected(true);
					onTimerTickCallback = OnTimerTick;
					onTimerFinishCallback = OnTimerFinish;
					
					socket.emit('QuestionSelected', defaultPacket);
				}
				Object.defineProperty(self, 'QuestionSelected', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionSelected
				});

				/*	Description
				 *	Params Descriptions
				 */
				function QuestionAnswered(correct, timeout)
				{
					if(currentQuestion == undefined)
						return;

					UnSubscribe();
					timer.Stop();

					socket.emit('QuestionAnswered', defaultPacket.Extend({ Correct: !!correct, Timeout: !!timeout, Score: currentQuestion.Value }));
				}
				Object.defineProperty(self, 'QuestionAnswered', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionAnswered
				});

				function GetScores(callback)
				{
					if(socket)
					{
						getScoresCallback = callback;
						socket.emit('GetScores', defaultPacket);
					}
					else
						callback();
				}
				Object.defineProperty(self, 'GetScores', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetScores
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
						
						QuestionAnswered(false, true);
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

				function SetupSockets()
				{
					socket.on('QuestionAnswered', function(data)
					{
						onTimerFinishCallback();
						
						currentQuestion = undefined;
						onTimerTickCallback = undefined;
						onTimerFinishCallback = undefined;

						if(CheckRoundEnded())
						{
							roundEndCallback();
						}
					});

					socket.on('QuestionSelected', function(data)
					{
						SetupEvents();
						timer.Start();
					});

					socket.on('Error', function(data)
					{
						errorCallback(data);
					});

					socket.on('Connected', function(data)
					{
						eventor.GetEvent('UserConnected')
							.Publish(data);
					});

					socket.on('Disconnected', function(data)
					{
						eventor.GetEvent('UserDisconnected')
							.Publish(data);
					});

					socket.on('BuzzIn', function(data)
					{
						timer.Stop();
						eventor.GetEvent('BuzzIn')
							.Publish(data);
					});

					socket.on('GameClosed', function(data)
					{
						if(endGameCallback)
						{
							endGameCallback(data);
						}
					});

					socket.on('GetScores', function(data)
					{
						if(getScoresCallback)
							getScoresCallback(data);
					});

					socket.on('disconnect', function()
					{
						alert('The game has disconnected!');
					});
				}

				function CheckRoundEnded()
				{
					var allComplete = true;
					categories.forEach(function(category)
					{
						category.Questions().forEach(function(question)
						{
							if(!question.HasBeenSelected())
							{
								allComplete = false;
								return false;
							}
						});
					});
					return allComplete;
				}
			}
		
			JeopardyGame.prototype.version = '2.0'
		
			// Return Constructor
			return JeopardyGame;
		})();

		JeopardyGameModule.JeopardyGame = JeopardyGame;

		return JeopardyGameModule;
	});
})();
