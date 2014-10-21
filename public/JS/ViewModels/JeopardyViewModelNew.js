/*		JeopardyViewModel JavaScript Module
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
		var requirements = ['Modules/JeopardyGameModule', 'Models/JeopardyModels', 'knockout',
							'Modules/ExceptionModule', 'Modules/EventAggregatorModule', 'Modules/ExtensionsModule',
							'highcharts'];


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
			var mods = [root['JeopardyViewModel'] = {}, root['module']];

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
	})(this, function(JeopardyViewModelExports, module, GameModule, Models, ko, Exceptions,
						Eventor, Extensions, HighCharts)
	{
		var JeopardyViewModel = typeof JeopardyViewModelExports !== Types.Undefined ? JeopardyViewModelExports : {},
			moduleData = module.config().data;

		// Start JeopardyViewModel module code here
		// Any publicly accessible methods should be attached to the "JeopardyViewModel" object created above
		// Any private functions or variables can be placed anywhere

		var ViewModel = (function(undefined){
			/**
			 * JeopardyViewModel constructor.
			 * @constructor
			 */
			var ViewModel = function JeopardyViewModel(data)
			{
				if(!(this instanceof ViewModel))
					return new JeopardyViewModel(data);
				
				data = data || {};
				var self = this,
					GameObj = new GameModule.JeopardyGame({
						TimerDuration: data.TimerDuration || 5
					}),
					eventor = new Eventor.EventAggregator(),
					categories = ko.observableArray(),
					answerWindow,
					settings,
					tokens = {},
					chartElement = data.Chart,
					tableElement = data.Table;
				
				Object.defineProperty(self, 'Categories', {
					get: function()
					{
						return (loaded() ? categories : function() { return []; }) ;
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var onlineGame = ko.observable(data.IsOnlineGame);
				Object.defineProperty(self, 'OnlineGame',{
					get: function()
					{
						return onlineGame;
					},
					set: function(value)
					{
						onlineGame(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var loaded = ko.computed(function()
					{
						return categories() && categories().length > 0;
					});
				Object.defineProperty(self, 'Loaded',{
					get: function()
					{
						return loaded;
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {number}
				 */
				var count = ko.observable();
				Object.defineProperty(self, 'Count',{
					get: function()
					{
						return count;
					},
					set: function(value)
					{
						count(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var showCount = ko.observable(false);
				Object.defineProperty(self, 'ShowCount',{
					get: function()
					{
						return showCount;
					},
					set: function(value)
					{
						showCount(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {object}
				 */
				var selectedQuestion = ko.observable();
				Object.defineProperty(self, 'SelectedQuestion',{
					get: function()
					{
						return selectedQuestion;
					},
					set: function(value)
					{
						selectedQuestion(value);
					},
					enumerable: true,
					configurable: false
				});

				var currentPlayer = ko.observable();
				Object.defineProperty(self, 'CurrentPlayer', {
					get: function() { return currentPlayer; },
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var gameEnded = ko.observable(false);
				Object.defineProperty(self, 'GameEnded',{
					get: function()
					{
						return gameEnded;
					},
					set: function(value)
					{
						gameEnded(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {array}
				 */
				var players = ko.observableArray();
				Object.defineProperty(self, 'Players',{
					get: function()
					{
						return players;
					},
					set: function(value)
					{
						players(value);
					},
					enumerable: true,
					configurable: false
				});

				/*	Initialize the gameboard and perform any server side calls
				 *	@param {Object} args holds data about starting the new game
				 *		Structure:	{
				  		          		RequiredCategories: array of category names that are required for this game
				  		          	}
				 */
				function StartGame()
				{
					categories.removeAll();
					Subscribe();

					GameObj.StartGame({
							RequiredCategories: data.Categories
							, IsOnlineGame: data.IsOnlineGame
							, Name: data.Name
							, OnlineUrl: data.OnlineUrl || "http://localhost:3000"
						},
						/* OnLoaded */
						function OnLoaded(categoryList)
						{
							categories(categoryList);
						},
						/* OnError */
						function OnError(errorMessage, errorData)
						{
							alert(errorMessage);
						},
						/* OnRoundEnd */
						function OnRoundEnd()
						{
							GameObj.GetScores(ShowScores);
						});
					
					if(!answerWindow)
						answerWindow = window.open('AnswerWindow.html', null, 'height=600,width=625,toolbar=no,titlebar=no,menubar=no,location=no,directories=no');
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame
				});

				function Subscribe()
				{
					tokens.BuzzIn = eventor.GetEvent('BuzzIn')
						.Subscribe(function(userInfo)
						{
							LogToConsole(userInfo.Username + " buzzed in.");
							currentPlayer(userInfo);
						});

					tokens.UserConnected = eventor.GetEvent('UserConnected')
						.Subscribe(function(userInfo)
						{
							LogToConsole(userInfo.Username + " connected.");
						});

					tokens.UserDisconnected = eventor.GetEvent('UserDisconnected')
						.Subscribe(function(userInfo)
						{
							LogToConsole(userInfo.Username + " disconnected.", "Warn");
						});
				}

				function UnSubscribe()
				{
					for(var key in tokens)
					{
						eventor.GetEvent(key).Unsubscribe(tokens[key]);
					}
					tokens = {};
				}

				/*	Show the question text, show the answer in the answer window, remove question from selection
				 *	
				 */
				function QuestionSelected(question)
				{
					if(question.HasBeenSelected())
					{
						return;
					}

					selectedQuestion(question);
					count(data.TimerDuration || 5);
					if(answerWindow)
						answerWindow.viewModel.ShowQuestion(question.Question, question.Answer);
					GameObj.QuestionSelected(question, OnTimerTick, OnTimerFinish);
					showCount(true);
				}
				Object.defineProperty(self, 'QuestionSelected', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionSelected
				});

				function QuestionDone(isCorrect)
				{
					GameObj.QuestionAnswered(isCorrect);
					currentPlayer(undefined);
				}
				Object.defineProperty(self, 'QuestionDone', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionDone
				});

				function OnTimerTick(time)
				{
					count(time);
				}

				function OnTimerFinish()
				{
					count(0);
					showCount(false);
					selectedQuestion(undefined);
					if(answerWindow)
						answerWindow.viewModel.HideQuestion();
				}

				/*	Description
				 *	Params Descriptions
				 */
				function ShowScores(data)
				{
					players.removeAll();
					data.Users.forEach(function(item)
						{
							players.push(item);
						});
					
					var chart = new Highcharts.Chart({
						data: {
							table: tableElement
						},
						chart: {
							renderTo: chartElement,
							type: 'column'
						},
						title: {
							text: "Results for " + data.Name
						},
						yAxis: {
							title: {
								text: 'Data'
							}
						},
						tooltip: {
							formatter: function() {
								return '<strong>' + this.series.name + '<strong><br />' +
								this.point.y + ' ' + this.point.name.toLowerCase();
							}
						}
					});

					gameEnded(true);
				}
				Object.defineProperty(self, 'ShowScores', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: ShowScores
				});

				function LogToConsole(str, category)
				{
					if(category == "Warn")
					{
						console.warn(str);
						answerWindow.viewModel.Console.Warn(str);
					}
					else
					{
						console.log(str);
						answerWindow.viewModel.Console.Log(str);
					}
				}

				var eventListener = window.addEventListener || window.attachEvent;
				eventListener('unload', function()
				{
					GameObj.EndGame(ShowScores);
				});
			}
		
			ViewModel.prototype.version = '2.0'
		
			// Return Constructor
			return ViewModel;
		})();
		JeopardyViewModel.ViewModel = ViewModel;

		return JeopardyViewModel;
	});
})();
