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

			factory(target, game, data, ko);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/JeopardyGameModule', 'Models/JeopardyModels',
				'knockout', 'Modules/ExceptionModule'], factory);
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
	})(function(JeopardyExports, JeopardyGame, Models, ko, Exceptions)
	{
		var Jeopardy = typeof JeopardyExports !== Types.Undefined ? JeopardyExports : {};
		
		// Start JeopardyViewModel module code here
		// Any publicly accessible methods should be attached to the "JeopardyViewModel" object created above
		// Any private functions or variables can be placed anywhere

//		Begin Private Variables


//		Begin Private Functions



//		Begin Classes

		Jeopardy.JeopardyViewModel = (function()
		{
			var JeopardyViewModel = function(args)
			{
				if(!(this instanceof JeopardyViewModel))
					return new JeopardyViewModel(args);

				var self = this,
					GameObj = new JeopardyGame.JeopardyGame({

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

				/*	Initialize the gameboard and perform any server side calls
				 *	@param {Object} args holds data about starting the new game
				 *		Structure:	{
				  		          		RequiredCategories: array of category names that are required for this game
				  		          	}
				 */
				self.StartGame = function(args)
				{
					args = args || {};
					GameObj.StartGame(
						{
							RequiredCategories: args.RequiredCategories
						},
						function(categoryList)
						{
							categories.removeAll();
							categoryList.forEach(function(item)
							{
								categories.push(new Models.JeopardyCategoryModel({
									name: item.Name,
									questions: item.questions
								}));
							})
						}
					);

					answerWindow = window.open('AnswerWindow.html', null, 'height=400,width=400,toolbar=no,titlebar=no,menubar=no,location=no,directories=no');
				}

				/*	Show the question text, show the answer in the answer window, remove question from selection
				 *	
				 */
				self.QuestionSelected = function(question)
				{
					if(question.HasBeenSelected())
					{
						return;
					}

					question.HasBeenSelected(true);
					answerWindow.viewmodel.showAnswer(question.Answer);
					console.log(question.Answer);
				}

				self.QuestionDone = function(question)
				{
					question.HasBeenShown(true);
				}
			}

			return JeopardyViewModel;
		})();

		return Jeopardy;
	});
})();