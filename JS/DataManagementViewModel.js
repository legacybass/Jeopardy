/*		DataManagement JavaScript Module
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
			var datacontext = module['DatabaseModelsModule'];
			var knockout = module['knockout'];

			factory(target, extensions, datacontext, knockout);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'ExtensionsModule', 'DatabaseModelsModule', 'knockout'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataManagement'] = {},
				window['ExtensionsModule'],
				window['DatabaseModelsModule'],
				window['ko']);
		}
	})(function(DataManagementExports, Extensions, DataContext, ko)
	{
		var DataManagement = typeof DataManagementExports !== Types.Undefined ? DataManagementExports : {};
		
		// Start DataManagement module code here
		// Any publicly accessible methods should be attached to the "DataManagement" object created above
		// Any private functions or variables can be placed anywhere

// Begin Private Static Variables
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

		var context = new DataContext.DataContext();
// End Variables

// Begin Private Functions
		var CreateDatabase = function(args)
		{
			
		}
		var CreateTable = function(args)
		{

		}

		var InsertDataIntoTable = function(args)
		{

		}
// End Private Functions

		DataManagement.DataManagement = (function(undefined)
		{
			// Private Static Variables
		
			// Private Static Methods
			
			// public API -- Constructor
			var DataManagement = function(data)
			{
				var self = this;
				var headers = ko.observableArray();
				Object.defineProperty(self, 'Headers',{
					get: function()
					{
						return headers;
					},
					enumerable: true,
					configurable: false
				});

				var records = ko.observableArray();
				Object.defineProperty(self, 'Records',{
					get: function()
					{
						return records;
					},
					enumerable: true,
					configurable: false
				});

				var LoadRecords = function(args)
				{
					
				}

				context.GetCategories({
					callback: LoadRecords.bind(self),
					databaseName: 'Jeopardy',
					databaseVersion: '1.0'
				});
			}
		
			DataManagement.prototype.version = '1.0'
		
			// Return Constructor
			return DataManagement;
		})();

		return DataManagement;
	});
})();