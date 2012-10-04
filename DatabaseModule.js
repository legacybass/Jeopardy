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

	(function(factory)
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
			factory(window['Database'] = {});
		}
	})(function(DatabaseExports)
	{
		var Database = typeof DatabaseExports !== Types.Undefined ? DatabaseExports : {};

		
		// Code in case the "bind" method hasn't been implemented by the browser
		if(!Function.prototype['bind'])
		{
			Function.prototype['bind'] = function(object)
			{
				var originalFunction = this,
					args = Array.prototype.slice.call(arguments),
					object = args.shift();
				return function()
				{
					return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
				}
			}
		}
		
		// Start Database module code here
		// Any publicly accessible methods should be attached to the "Database" object created above
		// Any private functions or variables can be placed anywhere

// Begin Classes

		function Database(dbName)
		{
			if(dbName == undefined || typeof dbName !== Types.String || dbName.length <=0)
				throw new Exception("Database name must be a valid string");

			var self = this;
			self.dbName = dbName;

			self.CreateTable = function(tableName, columns)
			{
				var tempTable = new Table(tableName, columns);
				self[tableName] = tempTable;
			}

			self.DropTable = function()
			{
				throw new Exception("Not yet implemented");
			}
		}
		Database.prototype = new Array();

		/*	Holds data like a DB table
		 *	@param {String} tableName Holds the name of the table
		 *	@param {Object} columns Holds information about the columns in the table
		 *		Should have the following structure [
		  												{
		  													name: 'ColName',
		  													type: 'String/Numeric',
		  													required: true/false
		  												}
		  											]
		 */
		function Table(tableName, columns)
		{
			if(tableName == undefined || typeof tableName !== Types.String || tableName.length <= 0)
				throw new Exception("Table name must be a valid string");

			var self = this;
			self.tableName = tableName;

			

			self.Insert = function()
			{
				throw new Exception("Not yet implemented");
			}

			self.Update = function()
			{
				throw new Exception("Not yet implemented");
			}

			self.Select = function()
			{
				throw new Exception("Not yet implemented");
			}
		}

		function Exception(message)
		{
			var self = this;
			self.message = message;
		}

// End Classes

// Begin Helper Functions //

		function RowFactory(str)
		{
			var code = "";
			return new Function(code);
		}

// End Helper Functions //
	});
})();