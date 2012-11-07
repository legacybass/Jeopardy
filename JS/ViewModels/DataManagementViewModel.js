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
			var models = require('Models/DataManagementModels');
			var knockoutMapping = require('komapping');

			factory(target, extensions, datacontext, exception, knockout, models, knockoutMapping);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExtensionsModule', 'DataContext',
						'Modules/ExceptionModule', 'knockout', 'Models/DataManagementModels', 'komapping'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataManagementViewModel'] = window['DataManagementViewModel'] || {},
				window['ExtensionsModule'],
				window['DataContext'],
				window['Exception'],
				window['ko'],
				window['DataManagementModels'],
				window['komapping']);
		}
	})(function(DataManagementExports, Extensions, DataContext, Exception, ko, Models, mapping)
	{
		var DataManagement = typeof DataManagementExports !== Types.Undefined ? DataManagementExports : {};
		
		// Start DataManagement module code here
		// Any publicly accessible methods should be attached to the "DataManagement" object created above
		// Any private functions or variables can be placed anywhere

// Begin Private Static Variables

// End Variables

// Begin Global Private Functions
		ko.bindingHandlers.foreachkey = (function()
		{
			return {
				init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
				{
					var child = ko.virtualElements.firstChild(element),
						childElems = [],
						value = valueAccessor(),
						allBindings = allBindingsAccessor();

					if(typeof value !== Types.Object || !value.data)
						value = {
							data: value
						};

					while(child)
					{
						if(child.tagName != undefined)
							childElems.push(child);

						child = ko.virtualElements.nextSibling(child);
					}

					var items = [];
					if(value.items && value.items.length > 0)
					{
						for(var i = 0; i < value.items.length; i++)
						{
							items[i] = value.items[i].toLowerCase();
						}
					}

					var childNodes = [];
					for(var key in value.data)
					{
						if(items.length > 0 && items.indexOf(("" + key).toLowerCase()) < 0)
							continue;

						var obj = value.data[key],
							objType = typeof obj,
							childContext = bindingContext.createChildContext(obj);

						for(var j = 0; j < childElems.length; j++)
						{
							var clonedChild = childElems[j].cloneNode(true);
							childNodes.push(clonedChild);
							ko.applyBindings(childContext, clonedChild);
						}
					}

					ko.virtualElements.setDomNodeChildren(element, childNodes);

					return { controlsDescendantBindings: true };
				},
				update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
				{
					
				}
			}
		})();
		ko.virtualElements.allowedBindings.foreachkey = true;

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
								Tables.push(new Models.Table({
									name: tableInfo.name,
									records: tableInfo.records,
									columns: tableInfo.columns
								}));

								counter++;
								if(counter >= tableNames.length - 3)
									Loading(false);
							});
						}
					});
				}

				self.AddRow = function(table)
				{
					Loading(true);
					var newRow = {};
					table.Columns.forEach(function(col)
					{
						newRow[col] = undefined;
					});

					var row = table.Add(newRow);

					table.ColumnData.forEach(function(col)
					{
						if(col.IsRequired)
						{
							newRow[col.Name] = 0;
						}
						if(col.IsPrimaryKey)
							delete newRow[col.Name];
					});

					db.AddTableRow(table.Name(), newRow, function(data)
					{
						row.id.Data(data.ID);
						Loading(false);
					});
				}

				self.EditRow = function(table, row)
				{
					if(row.IsEditing())
					{
						Loading(true);
						var obj = {};

						for(var key in row)
						{
							var data = row[key];
							if(!data.Writable)
								continue;

							obj[key] = data.Data();
						}

						obj.ID = row.id.Data();

						db.SaveChanges(table.Name(), obj, function(data)
						{
							Loading(false);
							row.IsEditing(false);
						});
					}
					else
						row.IsEditing(true);
				}

				self.RemoveRow = function(table, item)
				{
					Loading(true);
					db.DeleteTableRow(table.Name(), item.id.Data(), function()
						{
							table.Remove(item);
							Loading(false);
						});
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