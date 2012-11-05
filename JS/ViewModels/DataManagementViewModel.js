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
			var extensions = require('Modules/ExtensionsModule');
			var datacontext = require('DataContext');
			var exception = require('Modules/ExceptionModule');
			var knockout = require('knockout');
			var knockoutMapping = require('komapping');

			factory(target, extensions, datacontext, exception, knockout, knockoutMapping);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExtensionsModule', 'DataContext',
						'Modules/ExceptionModule', 'knockout', 'komapping'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataManagementViewModel'] = window['DataManagementViewModel'] || {},
				window['ExtensionsModule'],
				window['DataContext'],
				window['Exception'],
				window['ko'],
				window['komapping']);
		}
	})(function(DataManagementExports, Extensions, DataContext, Exception, ko, mapping)
	{
		var DataManagement = typeof DataManagementExports !== Types.Undefined ? DataManagementExports : {};
		
		// Start DataManagement module code here
		// Any publicly accessible methods should be attached to the "DataManagement" object created above
		// Any private functions or variables can be placed anywhere

// Begin Private Static Variables

// End Variables

// Begin Global Private Functions

// End Global Private Functions

		DataManagement.DataManagementViewModel = (function(undefined)
		{
			// Private Static Variables
		
			// Private Static Methods
			
			// public API -- Constructor
			var DataManagementViewModel = function(data)
			{
				var self = this,
					db,
					Tables = ko.observableArray(),
					Loading = ko.observable(false);

				self.LoadDatabase = function(dbName, version, description, size)
				{
					Loading(true);
					Tables.removeAll();

					db = new DataContext.DataContext({
						name: dbName,
						version: version,
						description: description,
						size: size
					});

					var counter = 0;
					db.GetTables(function(tableNames)
					{
						for(var i = 0; i < tableNames.length; i++)
						{
							var tableName = tableNames[i];
							db.GetTableInfo(tableName, function(tableInfo)
							{
								// TODO: Make these work with mapping
								// Until then, this should do the same basic thing
								var observableTableInfo = {};
								for(var key in tableInfo)
								{
									var obj = tableInfo[key];

									if(obj instanceof Array || (obj.length && obj.push))
									{
										observableTableInfo[key] = ko.observableArray(obj);
									}
									else
									{
										observableTableInfo[key] = ko.observable(obj);
									}
								}

								Tables.push(observableTableInfo);

								counter++;
								if(counter == tableNames.length - 1)
									Loading(false);
							});
						}
					});
				}

				self.AddRow = function(table)
				{
					var newRow = {};
					table.columns().forEach(function(col)
					{
						newRow[col] = 'Empty';
					});

					table.records.push(newRow);
				}

				self.SaveRow = function()
				{

				}

				self.RemoveRow = function(table, item)
				{
					console.log(table);
					console.log(item);
				}

				self.Loading = Loading;
				self.Tables = Tables;
			}
		
			DataManagementViewModel.prototype.version = '1.0'
		
			// Return Constructor
			return DataManagementViewModel;
		})();

		return DataManagement;
	});
})();