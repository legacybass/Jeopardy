/*		EntityFramework JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/16/2012
 */

(function()
{
	// Enum for types
	var Types = {
		Function: typeof function() {},
		Object: typeof {},
		String: typeof "",
		Number: typeof 1,
		Boolean: typeof false,
		Undefined: typeof undefined
	};

	(function(root, factory)
	{
		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var target = module['exports'] || exports;
			factory(target);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(root['EntityFramework'] = {});
		}
	})(this, function(EntityFrameworkExports)
	{
		var EntityFramework = typeof EntityFrameworkExports !== Types.Undefined ? EntityFrameworkExports : {};
		
		// Start EntityFramework module code here
		// Any publicly accessible methods should be attached to the "EntityFramework" object created above
		// Any private functions or variables can be placed anywhere

// Private variables

		var dbDefaults = {
			name: 'default',
			version: '1.0',
			description: 'Default database.',
			size: 1024 * 1024 * 2	// 2MB database
		};

// End private variables

// Private classes
		var Exception = (function()
		{
			var Exception = function (message)
			{
				var self = this;
				Object.defineProperty(self, 'message',{
					get: function()
					{
						return message;
					},
					enumerable: true,
					configurable: true
				});

				Object.defineProperty(self, 'name',{
					get: function()
					{
						return message;
					},
					enumerable: true,
					configurable: true
				});

				self.prototype.toString = function()
				{
					return message;
				}
			}

			return Exception;
		});
// End private classes

// Private functions

		/*	Implement the Trim function if not already implemented
		 */
		if(!String.prototype.trim)
		{
			String.prototype.trim = function()
			{
				return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}
		}

		/*	Take everything in obj2 and obj1 and move it into a new object overwriting same named things in obj1
		 *	@param {Object} obj1 The first object that will have its data copied into the returned object
		 *  @param {Object} obj2 The second object that will have its data copied
		 */
		function Extend(obj1, obj2)
		{
			var rtObj = Clone(obj1);
			Clone(obj2, rtObj);
			return rtObj;
		}

		/*	Make a recursive copy of the given object
		 *	@param {Object} obj The object to copy
		 */
		function Clone(obj, rtObj)
		{
			var objType = typeof obj;

			if(rtObj == undefined)
			{
				if(objType === Types.Object)
				{
					if(obj instanceof Array || !!obj.length)
					{
						// Assume this is an array
						rtObj = [];
					}
					else
					{
						// Assume it's a plain object
						rtObj = {};
					}
				}
				else if(objType === Types.Function)
				{
					rtObj = obj;
				}
			}

			for(var key in obj)
			{
				var data = obj[key],
					dataType = typeof data;

				if(dataType === Types.Object)
				{
					// Recursively copy sub-objects
					rtObj[key] = Clone(data);
				}
				else
				{
					rtObj[key] = data;
				}
			}

			return rtObj;
		}

		/*	Open a connection to the given database or create it new
		 *	@param {Object} args Holds information about the database to open/create
		 *		@structure: {
								name: Database name
								version: Database version
								description: Description of what the db will hold
								size: Size of the database
							}
		 *	@returns Database reference
		 */
		var OpenConnection = function(args)
		{
			args = Extend(Clone(dbDefaults), args);
			return openDatabase(args.name, args.version, args.description, args.size);
		}

		/*	Get a record of all the tables inside the database
		 *	@param {Object} database Reference to the database in SQL
		 *	@param {Function} callback Function to call when the tables are all enumerated
		 		@structure: @param {Results} results Results of getting the tables
		 *	@returns Object with the table names
		 */
		var GetTables = function(database, callback)
		{
			var SQL = "SELECT * FROM sqlite_master WHERE type = 'table'";
			database.readTransaction(function(tx)
			{
				tx.executeSql("SELECT * FROM sqlite_master WHERE type = 'table'", [], function(tx, results)
				{
					var len = results.rows.length,
						i = 0,
						tableNames = [];

					for(; i < len; i++)
					{
						var item = results.rows.item(i);
						tableNames.push(item.name);
					}

					callback(tableNames);
				});
			});
		}

		/*	Get a record of all the columns in a table
		 *	@param {Object} table Reference to the database table in SQL
		 *	@returns Object with the column names
		 */
		var GetColumns = function(database, table, calback)
		{
			database.readTransaction(function(tx)
			{
				tx.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "' + table + '";', [], function (tx, results) {
					var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
					var columnNames = [];
					for(i in columnParts) {
						if(typeof columnParts[i] === 'string')
							columnNames.push(columnParts[i].trim().split(" ")[0]);
					}
					
					callback(columnNames);
				});
			});
		}

// End private functions
		

// Public classes
		EntityFramework.DataStore = (function(undefined){
			// Private Variables

			// Private Methods
			var GetTablesCallback = function(self, database)
			{
				return function(tableNames)
				{
					for(var i = 0; i < results.length; i++)
					{
						var tableName = results[i];
						
						// TODO: Needs to be an array of a class that has the properties of the table.
						//		 Needs to be aware of when new rows are entered.
						//		 --		How to expose the class to users?
						//		 --		Create the class and attach it to self.
						GetColumns(database, tableName, function(columnNames)
						{
							
						});
					}
				}
			}

			/*	Class Factory that creates a constructor for a class based on the params
			 */
			function ClassFactory(args)
			{
					
			}

			// Init stuff
		
			// public API -- Methods
			// var CreateTable = function()
			// {

			// }
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var DataStore = function(data)
			{
				if(!window.openDatabase)
					throw new Exception('Browser does not support web databases.');

				var self = this,
					version,
					databaseName,
					database;

				data = data || {};

				if(data.databaseName == undefined)
					throw new Exception('Database name must be passed in.');

				databaseName = data.databaseName;
				version = data.databaseVersion;

				var connectionArgs = {
					name: databaseName,
					version: version
				};

				if(!!data.size)
					connectionArgs.size = data.size;
				if(!!data.description)
					connectionArgs.description = data.description;

				database = OpenConnection(connectionArgs);
				GetTables(database, GetTablesCallback(self, database));

				// self.CreateTable = CreateTable;
			}
		
			DataStore.prototype.version = '0.1'
		
			// Return Constructor
			Object.preventExtensions(DataStore);
			return DataStore;
		})();
// End public classes
	});
})();