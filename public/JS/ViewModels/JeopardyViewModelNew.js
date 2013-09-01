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
							'Modules/ExceptionModule', 'Modules/ExtensionsModule'];


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
	})(this, function(JeopardyViewModelExports, module, GameModule, Models, ko, Exceptions, Eventor, Extensions)
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
					categories = ko.observableArray(),
					answerWindow,
					settings;
				
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

					GameObj.StartGame({
							RequiredCategories: data.Categories
						},
						/* OnLoaded */
						function (categoryList)
						{
							categories(categoryList);
						});

					if(!answerWindow && false)
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
					if(answerWindow)
						answerWindow.viewModel.ShowAnswer(question.Answer);
					GameObj.QuestionSelected(question, OnTimerTick, OnTimerFinish);
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

				function OnTimerTick(time)
				{
					count(time);
				}

				function OnTimerFinish()
				{
					showCount(false);
					QuestionDone(selectedQuestion());
					if(answerWindow)
						answerWindow.viewModel.HideAnswer();
				}

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
			}
		
			ViewModel.prototype.version = '2.0'
		
			// Return Constructor
			return ViewModel;
		})();
		JeopardyViewModel.ViewModel = ViewModel;

		return JeopardyViewModel;
	});
})();