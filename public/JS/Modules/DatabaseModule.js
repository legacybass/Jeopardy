/*		Database JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/2/2012
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

	(function(root, factory)
	{
		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var target = module['exports'] || exports;
			var exception = require('Modules/ExceptionModule');
			var extensions = require('Modules/ExtensionsModule');
			factory(target, exception, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExceptionModule', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(root['Database'] = {},
					root['Exception'],
					root['Extensions']);
		}
	})(this, function(DatabaseExports, Exception, Extensions)
	{
		var DatabaseMod = typeof DatabaseExports !== Types.Undefined ? DatabaseExports : {};
		
		// Start Database module code here
		// Any publicly accessible methods should be attached to the "Database" object created above
		// Any private functions or variables can be placed anywhere

		var openDatabase = window['openDatabase'] || window['mozOpenDatabase'];

		if(!openDatabase)
		{
			throw new Exception.NotImplementedException("Web databases are not implemented in this browser.");
		}
// Begin Private Static Variables

	

// End Static Variables


// Begin Helper Functions //

		

// End Helper Functions //


// Begin Classes

		var Database = (function(undefined){
			// public API -- Constructor
			var Database = function(data)
			{
				if(!(this instanceof Database))
					return new Database(data);

				var self = this,
					db;

				if(typeof data === Types.Undefined || data.name == undefined || data.version == undefined)
					throw new Exception.InvalidArgumentException("Database must have a valid name and version.")

				db = openDatabase(data.name, data.version, data.description, data.size, data.callback);

				self.executeSql = function(sqlText, params, callback)
				{
					callback = callback || function() { };
					db.transaction(function(tx)
					{
						tx.executeSql(sqlText, params, function(tx, items)
							{
								var len = items.rows.length,
									results = [];
								for(var i = 0; i < len; i++)
								{
									results.push(items.rows.item(i));
								}

								callback(results);
							});
					});
				}

				self.readTransaction = function(sqlText, params, callback)
				{
					callback = callback || function() { };
					db.readTransaction(function(tx)
					{
						var operation = function(tx, items)
						{
							var len = items.rows.length,
								results = [];
							for(var i = 0; i < len; i++)
							{
								results.push(items.rows.item(i));
							}

							callback(results);
						};
						
						tx.executeTransaction(sqlText, params, operation);
					});
				}

				self.Export = function(ExportType)
				{
					switch(ExportType)
					{
						case ExportTypes.COMMA:
							return ExportComma();
						case ExportTypes.SQL:
							return ExportSQL();
						case ExportTypes.JSON:
						default:
							return ExportJson();
					}
				}

				self.Import = function(jsonData)
				{
					// TODO: Add functionality to import database data from JSON
				}
			}
		
			Database.prototype.version = '1.0'
		
			// Return Constructor
			return Database;
		})();
		
// End Classes


		/*	Open or create the specified database
		 *	@param {Object} args Arguments about the database
		 *		@Structure: {
								name:					The name of the database
								version:				The version of the database to open
								description (nullable):	A description of the database's use
								size (nullable):		The size to create the db
								callback (nullable):	A function to call when the DB has been created/opened
							}
		 */
		DatabaseMod.openDatabase = function(args)
		{
			if(typeof args == Types.Undefined || args.name == undefined || args.version == undefined)
				throw new Exception.InvalidArgumentException("Database must have a name and version.");

			args.description = args.description || "";
			args.size = args.size || (1024 * 1024 * 2);
			args.callback = args.callback || function() { };

			var db = new Database({
				name: args.name,
				version: args.version,
				description: args.description,
				OnCreated: args.callback
			});

			return db;
		}
	});
})();