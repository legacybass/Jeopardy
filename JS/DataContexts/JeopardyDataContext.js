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

// Begin Classes
		DataContext.DataContext = (function(undefined){
			// public API -- Constructor
			var DataContext = function(data)
			{
				if(!(this instanceof DataContext))
					return new DataContext(data);

				var self = this,
					db = Database.openDatabase({
						name: 'Jeopardy',
						version: '1.0',
						description: 'Database for storing Jeopardy questions.',
						size: 1024 * 1024 * 2
					});

				var sql = "CREATE TABLE IF NOT EXISTS Question (ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
					"Text TEXT NOT NULL, " +
					"Answer TEXT NOT NULL, " +
					"Value INTEGER NOT NULL)";
				db.executeSql(sql);

				sql = "CREATE TABLE IF NOT EXISTS Category (ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
					"Name TEXT NOT NULL)";
				db.executeSql(sql);

				sql = "CREATE TABLE IF NOT EXISTS QuestionCategory (ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
					"QuestionID INTEGER NOT NULL, " +
					"CategoryID INTEGER NOT NULL, " +
					"CONSTRAINT fk_QuestionCategory_QuestionID_Must_Exist FOREIGN KEY (QuestionID) REFERENCES Question(ID) ON DELETE CASCADE ON UPDATE CASCADE, " +
					"CONSTRAINT fk_QuestionCategory_CategoryID_Must_Exist FOREIGN KEY (CategoryID) REFERENCES Category(ID) ON DELETE CASCADE ON UPDATE CASCADE " +
					")";
				db.executeSql(sql);

				/*	Get 5 random questions within a category
				 *	@param {Object} args contains the information for loading the question
				 *		Structure:  {
				  						category: Name
				  					}
				 * @return {Object} A Models.Question object
				 */
				var GetQuestions = function(args, callback)
				{
					var sql = "SELECT * FROM Question Q " +
							  "JOIN QuestionCategory QC ON Q.ID = QC.QuestionID " +
							  "JOIN Category C ON QC.CategoryID = C.ID " +
							  "WHERE C.ID = ? " +
							  "ORDER BY Q.Value";
					db.executeSql(sql, [args.ID], function(results)
					{
						results.Randomize();
						var rtArr = [],
							val = 200;
						for(var i = 0; i < results.length; i++)
						{
							var question = results[i];
							if(question.Value == val)
							{
								rtArr.push(question);
								i = -1;
								val += 200;
							}

							if(val >= 1200)
								break;
						}

						callback(rtArr);
					});
				}

				/*	Get 6 random categories
				 *	@param {Object} args contains the information for loading the question
				 *		Structure:  {
				  						RequiredCategories: Array of categories that must exist in the round
				  					}
				 *	@return {Array} Array of Models.category objects
				 */
				var GetCategories = function(args, callback)
				{
					var sql = "SELECT * FROM Category";
					db.executeSql(sql, [], function(categories)
					{
						categories.Randomize();
						callback && callback(categories.slice(0, 6));
					});
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

				self.GetCategories = GetCategories.bind(self);
				self.GetQuestions = GetQuestions.bind(self);
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();

// End Classes

		return DataContext;
	});
})();