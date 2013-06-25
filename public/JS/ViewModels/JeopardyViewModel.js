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
			var game = require('Modules/JeopardyGameModule');
			var models = require('Models/JeopardyModels');
			var ko = require('knockout');
			var exceptions = require('Modules/ExceptionModule');
			var eventor = require('Modules/EventAggregatorModule');

			factory(target, game, data, ko, exceptions, eventor);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/JeopardyGameModule', 'Models/JeopardyModels',
				'knockout', 'Modules/ExceptionModule', 'Modules/EventAggregatorModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['JeopardyViewModel'] = window['JeopardyViewModel'] || {},
					window['JeopardyGameModule'],
					window['JeopardyModels'],
					window['ko'],
					window['ExceptionModule']);
		}
	})(function(JeopardyExports, JeopardyGame, Models, ko, Exceptions, EventAggregator)
	{
		var Jeopardy = typeof JeopardyExports !== Types.Undefined ? JeopardyExports : {};
		
		// Start JeopardyViewModel module code here
		// Any publicly accessible methods should be attached to the "JeopardyViewModel" object created above
		// Any private functions or variables can be placed anywhere

//		Begin Classes

		Jeopardy.JeopardyViewModel = (function()
		{
			var JeopardyViewModel = function(args)
			{
				if(!(this instanceof JeopardyViewModel))
					return new JeopardyViewModel(args);

				args = args || {};

				var self = this,
					GameObj = new JeopardyGame.JeopardyGame({
						TimerDuration: args.TimerDuration || 5
					}),
					categories = ko.observableArray(),
					answerWindow,
					settings,
					eventor = new EventAggregator.EventAggregator();

				Object.defineProperty(self, 'Categories', {
					get: function()
					{
						return (loaded() ? categories : function() { return []; }) ;
					},
					enumerable: true,
					configurable: false
				});

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

				/*	Initialize the gameboard and perform any server side calls
				 *	@param {Object} args holds data about starting the new game
				 *		Structure:	{
				  		          		RequiredCategories: array of category names that are required for this game
				  		          	}
				 */
				function StartGame()
				{
					categories.removeAll();
					SetupEvents();

					GameObj.StartGame({
						RequiredCategories: args.Categories
					});

					answerWindow = window.open('AnswerWindow.html', null, 'height=400,width=400,toolbar=no,titlebar=no,menubar=no,location=no,directories=no');
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame
				});

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
					answerWindow.viewmodel.showAnswer(question.Answer);
					GameObj.QuestionSelected(question);
				}
				Object.defineProperty(self, 'QuestionSelected', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionSelected
				});

				function QuestionDone()
				{
					selectedQuestion(undefined);
					GameObj.QuestionAnswered(selectedQuestion(), true);
				}
				Object.defineProperty(self, 'QuestionDone', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: QuestionDone
				});

				/*	Description
				 *	Params Descriptions
				 */
				function ShowScores()
				{
					
				}
				Object.defineProperty(self, 'ShowScores', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: ShowScores
				});

				function SetupEvents()
				{
					if(args.OnlineUrl)
					{
						eventor.GetEvent("NotifyContestantAnswered").Subscribe(function(data)
						{
							console.log(data);
						});
					}
					eventor.GetEvent("NotifyQuestionsLoaded").Subscribe(function(categoryList)
					{
						categories(GameObj.Categories);
					});
					eventor.GetEvent("NotifyTimerStarted").Subscribe(function(time)
					{
						showCount(true);
						count(time);
					});
					eventor.GetEvent("NotifyTimerChanged").Subscribe(function(timeRemaining)
					{
						count(timeRemaining);
					});
					eventor.GetEvent("NotifyTimerExpired").Subscribe(function(time)
					{
						showCount(false);
						QuestionDone(selectedQuestion());
					});
				}
			}

			return JeopardyViewModel;
		})();

		return Jeopardy;
	});
})();