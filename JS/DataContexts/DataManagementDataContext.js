/*		Data Management DataContext JavaScript Module
 *		Author: Daniel Beus
 *		Date: 11/2/2012
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
			var db = require('Modules/DatabaseModule');
			factory(target, db);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/DatabaseModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataContext'] = {});
		}
	})(function(DataContextExports, Database)
	{
		var DataContext = typeof DataContextExports !== Types.Undefined ? DataContextExports : {};

		// Start DataContext module code here
		// Any publicly accessible methods should be attached to the "DataContext" object created above
		// Any private functions or variables can be placed anywhere

		DataContext.DataContext = (function(undefined){
			// Dependencies
		
			// Private Variables
		
			// Private Methods
		
			// Init stuff
		
			// public API -- Methods
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var DataContext = function(data)
			{
				var self = this,
					db;
				db = Database.openDatabase(data);

				self.GetTables = function(callback)
				{
					var sql = "SELECT * FROM sqlite_master WHERE type='table';"
					db.executeSql(sql, [], function(tables)
					{
						var rtArr = [];
						tables.forEach(function(item)
						{
							rtArr.push(item.name);
						});
						callback(rtArr);
					});
				}

				self.GetTableInfo = function(table, callback)
				{
					var sql = 'SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "' + table + '";'
					db.executeSql(sql, [], function(info)
					{
						var columnParts = info[0].sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(','); ///// RegEx
						var columnInfo = [],
							columnNames = [];

						for(i in columnParts) {
							var temp = columnParts[i];
							if(typeof temp === 'string')
							{
								temp = temp.trim();
								var parts = temp.split(" ");
								columnInfo.push({
									name: parts[0],
									props: parts.slice(1, parts.length).join(" ")
								});
								columnNames.push(parts[0]);
							}
						}

						self.GetTableData(table, columnNames, function(records)
						{
							callback({
								columns: columnInfo,
								records: records,
								name: table
							});
						})
					});
				}

				self.GetTableData = function(table, columns, callback, orderby)
				{
					var sql = 'SELECT ';

					if(columns == undefined || columns.length == 0)
						sql += '* ';
					else
					{
						for(var i = 0; i < columns.length - 1; i++)
						{
							sql += columns[i] + ', ';
						}
						sql += columns[columns.length - 1] + ' ';
					}

					sql += 'FROM ' + table;

					if(orderby)
						sql += ' ORDER BY ' + orderby;
					else
						sql += ' ORDER BY ID';

					db.executeSql(sql, [], function(info)
					{
						var len = info.length,
							dataArr = [];
						for(var i = 0; i < len; i++)
						{
							dataArr.push(info[i]);
						}

						callback(dataArr);
					});
				}

				self.AddTable = function(name, columns, callback)
				{
					var sql = "CREATE TABLE IF NOT EXISTS " + name + " ( ID INTEGER PRIMARY KEY ON CONFLICT FAIL AUTOINCREMENT, ";
					for(var key in columns)
					{
						if(key.toLowerCase.trim() == "id")
							continue;

						var obj = columns[key];

						sql += key + obj + ", ";
					}

					sql = sql.substring(0, sql.length - 2);
					db.executeSql(sql, [], function()
					{
						callback && callback();
					});
				}

				self.AddTableRow = function(table, dataArray, callback)
				{
					var sql = "INSERT INTO " + table + "( ",
						valueStr = "VALUES ( ",
						values = [],
						counter = 0;

					for(var key in dataArray)
					{
						var obj = dataArray[key];

						sql += key;
						valueStr += "?";

						values.push(obj);

						counter++;
						if(counter < dataArray.Count)
						{
							sql += ", ";
							valueStr += ", ";
						}
					}

					sql += ") ";
					valueStr += ") ";
					
					sql += valueStr;

					db.executeSql(sql, values, function(info)
					{
						var sql = "SELECT last_insert_rowid() AS ID;"
						db.executeSql(sql, [], function(id)
						{
							sql = "SELECT * FROM " + table + " WHERE ID = " + id[0]['ID'];
							db.executeSql(sql, [], function(row)
							{
								callback && callback(row[0]);
							});
						});
					});
				}

				self.DeleteTableRow = function(table, id, callback)
				{
					var sql = "DELETE FROM " + table + " WHERE ID = " + id;
					db.executeSql(sql, [], function(info)
					{
						callback && callback(info);
					});
				}

				self.Export = function()
				{
					// TODO: Add functionality to export the entire database
				}

				self.Import = function(jsonData)
				{
					// TODO: Add functionality to import database data from JSON
				}

				self.SaveChanges = function(table, data, callback)
				{
					var sql = "UPDATE " + table + " SET ",
						values = [];
					for(var key in data)
					{
						if(key.toLowerCase() == "id")
							continue;

						sql += key + " = ?, "
						values.push(data[key]);
					}

					sql = sql.substring(0, sql.length - 2);

					sql += " WHERE ID = " + data.ID;

					db.executeSql(sql, values, function(results)
					{
						callback && callback(results);
					})
				}
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();

		return DataContext;
	});
})();