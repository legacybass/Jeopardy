/*		DatabaseModelsModule JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/22/2012
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
			var extensions = module['ExtensionsModule'];

			factory(target, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DatabaseModelsModule'] = {},
				window['ExtensionsModule']);
		}
	})(function(DatabaseModelsModuleExports, Extensions)
	{
		var DatabaseModelsModule = typeof DatabaseModelsModuleExports !== Types.Undefined ? DatabaseModelsModuleExports : {};

		// Start DatabaseModelsModule module code here
		// Any publicly accessible methods should be attached to the "DatabaseModelsModule" object created above
		// Any private functions or variables can be placed anywhere
		var database = openDatabase('Jeopardy', '1.0', 'Jeopardy categories and questions', 2 * 1024 * 1024);
		
		DatabaseModelsModule.DataContext = (function(undefined){
			// Dependencies
		
			// Private Static Variables
		
			// Private Static Methods
			var GetCategories = function(args)
			{
				database.transaction(function(tx)
				{
					tx.executeSql('SELECT * FROM Category', [], function(tx, results)
					{
						var len = results.rows.length;
						var rtObj = [];

						for(var i = 0; i < len; i++)
						{
							rtObj.push(results.rows.item(i));
						}
					});
				});
			}

			var GetQuestions = function(args)
			{

			}

			var GetCategoryQuestions = function(args)
			{

			}

			var InsertCategory = function(args)
			{

			}

			var InsertQuestion = function(args)
			{

			}

			var InsertCategoryQuestion = function(args)
			{

			}
		
			// Init stuff
		
			// public API -- Methods
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var DataContext = function(data)
			{
				var self = this;
				self.GetCategories = GetCategories.bind(self);
				self.GetQuestions = GetQuestions.bind(self);
				self.GetCategoryQuestions = GetCategoryQuestions.bind(self);
				self.InsertCategory = InsertCategory.bind(self);
				self.InsertQuestion = InsertQuestion.bind(self);
				self.InsertCategoryQuestion = InsertCategoryQuestion.bind(self);
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();
	});
})();