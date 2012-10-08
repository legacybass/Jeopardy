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
			factory(target, knockout, exceptions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExceptionModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(
				window['JeopardyModels'] = window['JeopardyModels'] || {},
				window['Exception']
			);
		}
	})(function(JeopardyExports, Exceptions)
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
			var JeopardyQuestionModel = function(args)
			{
				args = args || {};
				var self = this,
					DataObj = args.DataObj;

				self.question = args.question;
				self.answer = args.answer;
				self.value = args.value;
				self.category = args.category;
				self.visible = args.visible;
			}

			return JeopardyQuestionModel;
		})();

		Jeopardy.JeopardyCategoryModel = (function()
		{


			var JeopardyCategoryModel = function(args)
			{
				args = args || {};
				var self = this;

				self.name = args.name;
				self.questions = args.questions || [];
			}

			return JeopardyCategoryModel;
		})();

// End Classes
	
		return Jeopardy;
	});
})();