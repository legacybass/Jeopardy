/*		DatabaseInteractions JavaScript Module
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
			var database = module['Modules/DatabaseModule'];
			var exception = module['Modules/ExceptionModule'] || Exception;
			var extensions = module['Modules/Extensions'] || Extensions;
			factory(target, database, exception);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/DatabaseModule','Modules/ExceptionModule', 'Modules/Extensions'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DatabaseInteractions'] = window['DatabaseInteractions'] || {},
				window['Database'],
				window['Exception'],
				window['Extensions']);
		}
	})(function(DatabaseInteractionsExports, Database, Exception, Extensions)
	{
		var DatabaseInteractions = typeof DatabaseInteractionsExports !== Types.Undefined ? DatabaseInteractionsExports : {};

		// Start DatabaseInteractions module code here
		// Any publicly accessible methods should be attached to the "DatabaseInteractions" object created above
		// Any private functions or variables can be placed anywhere

		DatabaseInteractions.DatabaseInteractions = (function(undefined){
			// Dependencies
		
			// Private Variables
		
			// Private Methods
		
			// Init stuff
		
			// public API -- Methods
		
			// public API -- Prototype Methods
			
			// public API -- Constructor
			var DatabaseInteractions = function(data)
			{
				var self = this,
					db;

				if(typeof data === Types.Undefined || data.name == undefined || data.version =- undefined)
					throw new Exception.InvalidArgumentException('Database must have a valid name and version.');

				db = Database.openDatabase(data);

				/*	Create a SQL table with given columns
				 *	@param {Object} args
				 *		@Structure: {
										name: Table name
										checkExists: bool to check if the table exists
										columns: objects that contain info about the columns
											@Structure: {
															name: column name
															props: array of properties
														}
									}
				 */
				self.Create = (function(args)
				{
					var sql = 'CREATE TABLE ';
					args.callback = args.callback || function() { };

					if(args.checkExists)
						sql += 'IF NOT EXISTS ';
					sql += args.name || 'foo ';
					sql += '( ';
					
					var len = args.columns.length,
						i;
					for(i = 0; i < len; i++)
					{
						var obj = args.columns[i];
						sql += obj.name + ' ';

						var propsLen = (obj.props && obj.props.length ? obj.props.length : 0);
						for(var j = 0; j < propsLen; j++)
						{
							sql += obj.props[j] + ' ';
						}

						if(i < len - 1)
							sql += ', ';
					}

					sql += ')'

					db.executeSql(sql, [], args.callback);
				}).bind(self);


				/*	Insert data into a given table with SQL Injection protection
				 *	@param {Object} args
				 *		@Structure: {
										tableName: name of the table
										values: key/value pairs to insert
									}
				 */
				self.Insert = (function(args)
				{
					var sql = 'INSERT INTO ' + args.tableName + ' (',
						valuesStr = '( ',
						values = [],
						counter = 0;
					args.callback = args.callback || function() { };

					for(var key in args.values)
					{
						var data = args.values[key];

						sql += key;
						valuesStr += '?';
						values.push(data);

						counter++;
						if(counter != args.values.length)
						{
							sql += ', ';
							valuesStr += ', ';
						}
					}

					sql += ') ';
					valuesStr += ') ';
					sql += valuesStr;

					db.executeSql(sql, values, args.callback);
				}).bind(self);

				self.Select = (function(args)
				{
					db.executeSql(args.sql, args.params || [], args.callback);
				}).bind(self);

				self.Update = (function()
				{
					
				}).bind(self);
			}
		
			DatabaseInteractions.prototype.version = '1.0'
		
			// Return Constructor
			return DatabaseInteractions;
		})();
		

		return DatabaseInteractions;
	});
})();