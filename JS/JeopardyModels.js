/*		JeopardyQuestionModel JavaScript Module
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
			var exceptions = module['ExceptionModule'];
			var knockout = module['knockout'];
			factory(target, knockout, exceptions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExceptionModule', 'knockout'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(
				window['JeopardyViewModel'] = window['JeopardyViewModel'] || {},
				window['Exception'],
				window['ko']
			);
		}
	})(function(JeopardyExports, Exceptions, ko)
	{
		var Jeopardy = typeof JeopardyExports !== Types.Undefined ? JeopardyExports : {};

		
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
		
		// Start JeopardyQuestionModel module code here
		// Any publicly accessible methods should be attached to the "Jeopardy" object created above
		// Any private functions or variables can be placed anywhere

// Begin Classes

		/*	Hold data about a single Jeopardy question
		 *	@param (Object) args Parameter object that holds the data to be inserted into this question.
		 *			Structure:  {
		  							DataObj: //Object that can retrieve and persist data
		  						}
		 */
		Jeopardy.JeopardyQuestionModel = (function()
		{
			var JeopardyQuestionModel = function(args)
			{
				args = args || {};
				var self = this,
					DataObj = args.DataObj;

				var question = args.question;
				Object.defineProperty(self, 'Question',{
					get: function()
					{
						return question;
					},
					set: function(value)
					{
						question(value);
					},
					enumerable: true,
					configurable: false
				});

				var answer = args.answer;
				Object.defineProperty(self, 'Answer',{
					get: function()
					{
						return answer;
					},
					enumerable: true,
					configurable: false
				});

				var value = args.value;
				Object.defineProperty(self, 'Value',{
					get: function()
					{
						return value;
					},
					enumerable: true,
					configurable: false
				});

				var category = args.category;
				Object.defineProperty(self, 'Category',{
					get: function()
					{
						return category;
					},
					enumerable: true,
					configurable: false
				});

				var hasBeenSelected = ko.observable(args.hasBeenSelected == undefined ? false : !!args.hasBeenSelected);
				Object.defineProperty(self, 'HasBeenSelected',{
					get: function()
					{
						return hasBeenSelected;
					},
					set: function(value)
					{
						hasBeenSelected(!!value);
					},
					enumerable: true,
					configurable: false
				});

				var hasBeenShown = ko.observable(args.hasBeenShown == undefined ? false : !!args.hasBeenShown);
				Object.defineProperty(self, 'HasBeenShown',{
					get: function()
					{
						return hasBeenShown;
					},
					set: function(value)
					{
						hasBeenShown(value);
					},
					enumerable: true,
					configurable: false
				});
			}

			return JeopardyQuestionModel;
		})();

		Jeopardy.JeopardyCategoryModel = (function()
		{


			var JeopardyCategoryModel = function(args)
			{
				args = args || {};
				var self = this;

				var name = ko.observable(args.name);
				 Object.defineProperty(self, 'Name',{
					get: function()
					{
						return name;
					},
					enumerable: true,
					configurable: false
				 });
				var questions = ko.observableArray(args.questions || []);
				 Object.defineProperty(self, 'Questions',{
					get: function()
					{
						return questions;
					},
					enumerable: true,
					configurable: false
				 });
			}

			return JeopardyCategoryModel;
		})();

// End Classes
	
		return Jeopardy;
	});
})();