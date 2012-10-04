/*		DataContext JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/4/2012
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
			var exception = module['Exception'] || Exception;
			factory(target, exception);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExceptionModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataContext'] = {});
		}
	})(function(DataContextExports, Exception)
	{
		var DataContext = typeof DataContextExports !== Types.Undefined ? DataContextExports : {};

		
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
		
		// Start DataContext module code here
		// Any publicly accessible methods should be attached to the "DataContext" object created above
		// Any private functions or variables can be placed anywhere

		
		var questionIDs = [],  		// Used to store the id of questions from previous rounds
		    categoryNames = [];		// Used to store the names of previous rounds' categories

// Begin Functions

		/*	Get 5 random questions within a category
		 *	@param {Object} args contains the information for loading the question
		 *		Structure:  {
		  						category: Name
		  					}
		 */
		DataContext.GetQuestions = function(args)
		{
			throw new Exception.NotImplementedException('GetQuestions not yet implemented');
		}

		/*	Get 5 random questions within a category
		 *	@param {Object} args contains the information for loading the question
		 *		Structure:  {
		  						RequiredCategories: Array of categories that must exist in the round
		  					}
		 */
		DataContext.GetCategories = function(args)
		{
			throw new Exception.NotImplementedException('GetCategories not yet implemented');
		}

		/*	Get the final Question and Category
		 *	@param {Object} args contains the information for loading the question
		 *		Structure:  {
		  						
		  					}
		  	@returns {Object}
		  		Structure:	{
		  		          		category:	The category of the question
		  		          		question:	The question itself
		  		          		answer:  	The question answer
		  		          	}
		 */
		DataContext.GetFinalQuestion = function(args)
		{
			throw new Exception.NotImplementedException('GetFinalQuestion not yet implemented');
		}

// End Functions
	});
})();