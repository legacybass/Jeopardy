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
			var exception = module['ExceptionModule'];
			var Models = module['JeopardyModels']
			factory(target, exception, Models);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExceptionModule', 'JeopardyModels'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataContext'] = window['DataContext'] || {},
					window['Exception'],
					window['JeopardyModels']);
		}
	})(function(DataContextExports, Exception, Models)
	{
		var DataContext = typeof DataContextExports !== Types.Undefined ? DataContextExports : {};
		
		// Start DataContext module code here
		// Any publicly accessible methods should be attached to the "DataContext" object created above
		// Any private functions or variables can be placed anywhere

// Begin Variables
		var questionIDs = [],  		// Used to store the id of questions from previous rounds
		    categoryNames = [],		// Used to store the names of previous rounds' categories
		    database;

		var categories = [
			{
				name: 'Dependency Injection',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'MVC 3',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'Object Orientation',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'SQL',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'Things I Wish I Knew Before Graduating',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'Test Driven Development',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'IDEs and Their Usefulness',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			},
			{
				name: 'Dr. Horrible\'s Single-Along Blog',
				questions: [
				 	{
				 		text: 'testing 1',
				 		answer: 'answer 1',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 2',
				 		answer: 'answer 2',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 3',
				 		answer: 'answer 3',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 4',
				 		answer: 'answer 4',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 5',
				 		answer: 'answer 5',
				 		value: 1000
				 	},
				 	{
				 		text: 'testing 6',
				 		answer: 'answer 6',
				 		value: 200
				 	},
				 	{
				 		text: 'testing 7',
				 		answer: 'answer 7',
				 		value: 400
				 	},
				 	{
				 		text: 'testing 8',
				 		answer: 'answer 8',
				 		value: 600
				 	},
				 	{
				 		text: 'testing 9',
				 		answer: 'answer 9',
				 		value: 800
				 	},
				 	{
				 		text: 'testing 10',
				 		answer: 'answer 10',
				 		value: 1000
				 	}
				]	
			}
		];
// End Variables

// Begin Private Functions
		var CreateDatabase = function(args)
		{
			CreateTable({
				tableName: 'Category',
				columns: [
					{
						name: 'ID',
						props: 'unique number'
					},
					{
						name: 'Name',
						props: 'text'
					}
				]
			});
			CreateTable({
				tableName: 'Question',
				columns: [
					{
						name: 'ID',
						props: 'unique number'
					},
					{
						name: 'QuestionText',
						props: 'text'
					},
					{
						name: 'Answer',
						props: 'text'
					}
				]
			});
			CreateTable({
				tableName: 'CategoryQuestions',
				columns: [
					{
						name: 'ID',
						props: 'unique number'
					},
					{
						name: 'CategoryID',
						props: 'number'
					},
					{
						name: 'QuestionID',
						props: 'number'
					}
				]
			});

			for(var i = 0; i < categories.length; i++)
			{
				var obj = categories[i];
				InsertDataIntoTable({
					tableName: 'Category',
					columns: ['ID', 'Name'],
					values: [i, "'" + obj.name + "'"]
				});

				for(var j = 0; j < obj.questions.length; j++)
				{
					var qObj = obj.questions[j];
					InsertDataIntoTable({
						tableName: 'Question',
						columns: ['ID', 'QuestionText', 'Answer', 'Value'],
						values: [(j * (i + 1)), "'" + qObj.text + "'", "'" + qObj.answer + "'", qObj.value]
					});

					InsertDataIntoTable({
						tableName: 'CategoryQuestions',
						columns: ['ID', 'CategoryID', 'QuestionID'],
						values: 
					});
				}
			}
		}
		var CreateTable = function(args)
		{

		}

		var InsertDataIntoTable = function(args)
		{

		}
// End Private Functions

// Begin Functions

		/*	Get 5 random questions within a category
		 *	@param {Object} args contains the information for loading the question
		 *		Structure:  {
		  						category: Name
		  					}
		 * @return {Object} A Models.Question object
		 */
		DataContext.GetQuestions = function(args)
		{
			
		}

		/*	Get 5 random questions within a category
		 *	@param {Object} args contains the information for loading the question
		 *		Structure:  {
		  						RequiredCategories: Array of categories that must exist in the round
		  					}
		 *	@return {Array} Array of Models.category objects
		 */
		DataContext.GetCategories = function(args)
		{
			// Go to data storage and get 5 categories
			// ? Then populate each question in category
			if(database == undefined)
			{
				database = openDatabase('Jeopardy', '1.0', 'Jeopardy Game Database', 2 * 1024 * 1024);
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
		DataContext.GetFinalQuestion = function(args)
		{
			throw new Exception.NotImplementedException('GetFinalQuestion not yet implemented');
		}

		/*	Set the questions for a given category
		 *
		 */
		DataContext.SetQuestions = function(args)
		{

		}

		/*	Set the categories for the given game
		 *
		 */
		DataContext.SetCategories = function(args)
		{

		}

// End Functions

		return DataContext;
	});
})();