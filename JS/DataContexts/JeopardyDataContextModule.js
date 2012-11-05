/*		Jeopardy Game DataContext JavaScript Module
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
			var exception = module['Modules/ExceptionModule'];
			var Models = module['Models/JeopardyModels'];
			var db = module['Modules/DatabaseModule'];
			factory(target, exception, Models, db);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExceptionModule', 'Models/JeopardyModels', 'Modules/DatabaseModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataContext'] = window['DataContext'] || {},
					window['Exception'],
					window['JeopardyModels'],
					window['Database']);
		}
	})(function(DataContextExports, Exception, Models, Database)
	{
		var DataContext = typeof DataContextExports !== Types.Undefined ? DataContextExports : {};
		
		// Start DataContext module code here
		// Any publicly accessible methods should be attached to the "DataContext" object created above
		// Any private functions or variables can be placed anywhere

// Begin Variables
		var questionIDs = [],  		// Used to store the id of questions from previous rounds
		    categoryNames = [],		// Used to store the names of previous rounds' categories
		    database;

// End Private Functions

// Begin Functions
		DataContext.DataContext = (function(undefined){
			/*	Get 5 random questions within a category
			 *	@param {Object} args contains the information for loading the question
			 *		Structure:  {
			  						category: Name
			  					}
			 * @return {Object} A Models.Question object
			 */
			var GetQuestions = function(args)
			{
				throw new Exception.NotImplementedException('GetQuestions not yet implemented');
			}

			/*	Get 5 random questions within a category
			 *	@param {Object} args contains the information for loading the question
			 *		Structure:  {
			  						RequiredCategories: Array of categories that must exist in the round
			  					}
			 *	@return {Array} Array of Models.category objects
			 */
			var GetCategories = function(args)
			{
				// Go to data storage and get 5 categories
				// ? Then populate each question in category
				if(database == undefined)
				{
					database = Database.openDatabase('Jeopardy', '1.0', 'Jeopardy Game Database', 2 * 1024 * 1024);
				}
				else
				{
					return [
						{
							Name: 'Test 1',
							Questions: []
						},
						{
							Name: 'Test 2',
							Questions: []
						}
					]
				}
				
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
			var GetFinalQuestion = function(args)
			{
				throw new Exception.NotImplementedException('GetFinalQuestion not yet implemented');
			}
		
			// public API -- Constructor
			var DataContext = function(data)
			{
				var self = this;
				self.GetCategories = GetCategories.bind(self);
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();

// End Functions

		return DataContext;
	});
})();