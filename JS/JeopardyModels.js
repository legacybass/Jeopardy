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
			var knockout = module['knockout'] || window['knockout'];
			var exceptions = module['ExceptionsModule'] || window['ExceptionsModule'];
			factory(target, knockout, exceptions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'knockout', 'ExceptionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(
				window['JeopardyModels'] = window['JeopardyModels'] || {},
				window['ko'],
				window['ExceptionsModule']
			);
		}
	})(function(JeopardyExports, ko, Exceptions)
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
		var JeopardyQuestionModel = (function()
		{
			function(args)
			{
				args = args || {};
				var self = this,
					DataObj = args.DataObj;

				self.question = ko.observable();
				self.answer = ko.observable();
				self.value = ko.observable();
				self.category = ko.observable();
			}
		})();

		var JeopardyCategoryModel = (function()
		{


			var JeopardyCategoryModel = function(args)
			{
				var self = this;
				args = args || {};

				self.header = ko.observable(args.header);
				self.questions = ko.observableArray();
			}

			return JeopardyCategoryModel;
		})();

		Jeopardy.JeopardyGame = (function()
		{
			var DataObj,
				answerWindow,
				round = 0,
				categories;

			/*	Begin the game
			 *	@param {Object} args Information about game setup
			 *		Structure:	{
			  		          		RequiredCategories: Array of category names
			  		          	}
			 */
			function StartGame(args)
			{
				answerWindow = window.open('AnswerWindow.html', null, null, null);
				categories = DataObj.GetCategories({
					RequiredCategories: args.RequiredCategories
				});
			}


			return function(args)
			{
				args = args || {};
				var self = this;

				if(args.DataContext == undefined)
					throw new Exception.InvalidArgumentException('The DataContext must be defined.');

				DataObj = args.DataContext;

				self.StartGame = StartGame;
			}
		})();

// End Classes

	});
})();