/*		DataContextBase JavaScript Module
 *		Author: Daniel Beus
 *		Date: 1/2/2013
 */

(function()
{
	/**
	 * Enumeration for comparing types.
	 * @enum {string}
	 */
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
			factory(target, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataContextBase'] = {});
		}
	})(function(DataContextBaseExports, Extensions)
	{
		var DataContextBase = typeof DataContextBaseExports !== Types.Undefined ? DataContextBaseExports : {};

		
		// Start DataContextBase module code here
		// Any publicly accessible methods should be attached to the "DataContextBase" object created above
		// Any private functions or variables can be placed anywhere

		var ContextBase = (function(undefined){
			var ExportTypes = {
				JSON: 0,
				COMMA: 1,
				SQL: 2
			};

			function ToComma(obj)
			{
				var rtStr = '';
				obj.forEach(function(item)
				{
					rtStr += item.Name + ', ';
					item.Columns.forEach(function(col)
					{
						rtStr += col.Name + ', ';
					});
				});
			}

			/**
			 * ContextBase constructor.
			 * @constructor
			 */
			var ContextBase = function ContextBase(data)
			{
				if(!(this instanceof ContextBase))
					return new ContextBase(data);
				
				var self = this,
					tables = data;
				data = data || {};
				self.ExportTypes = ExportTypes;

				self.GetTables = function() { }
				self.GetTableInfo = function() { }
				self.GetTableData = function() { }
				
				function ExportJson(data)
				{
					return tables.Stringify();
				}

				function ExportComma(data)
				{

				}

				function ExportSql(data)
				{

				}

				function ExportDB(exportType)
				{
					switch(exportType)
					{
						case ExportTypes.COMMA:
							return ExportComma();
						case ExportTypes.SQL:
							return ExportSql();
						case ExportTypes.JSON:
						default:
							return ExportJson();
					}
				}

				Object.defineProperty(self, 'ExportJson',{
					get: function()
					{
						return ExportJson;
					},
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(self, 'ExportComma',{
					get: function()
					{
						return ExportComma;
					},
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(self, 'ExportSql',{
					get: function()
					{
						return ExportSql;
					},
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(self, 'ExportTypes',{
					get: function()
					{
						return ExportTypes;
					},
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(self, 'ExportDB', {
					get: function()
					{
						return ExportDB;
					},
					enumerable: false,
					configurable: false
				});
			}
		
			ContextBase.prototype.version = '1.0'
		
			// Return Constructor
			return ContextBase;
		})();
		DataContextBase.ContextBase = ContextBase;



		var Table = (function(undefined){
			/**
			 * Table constructor.
			 * @constructor
			 */
			var Table = function Table(data)
			{
				if(!(this instanceof Table))
					return new Table(data);
				
				var self = this;
				data = data || {};
				
				/**
				 *	@define {string}
				 */
				var name;
				Object.defineProperty(self, 'Name',{
					get: function()
					{
						return name;
					},
					set: function(value)
					{
						name = value;
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {array}
				 */
				var columns = new Array();
				Object.defineProperty(self, 'Columns',{
					get: function()
					{
						return columns;
					},
					set: function(value)
					{
						columns = value;
					},
					enumerable: true,
					configurable: false
				});


				/**
				 *	@define {array}
				 */
				var rows = new Array();
				Object.defineProperty(self, 'Rows',{
					get: function()
					{
						return rows;
					},
					enumerable: true,
					configurable: false
				});

				function ClassFactory()
				{
					var rtStr = 'var self = this; ';
					columns.forEach(function(col)
					{
						rtStr += "var _" + col.Name + "; " +
							"Object.defineProperty(self, '" + col.Name + "', { " +
								"get: function() { return _" + col.Name + "; }, " +
								"set: function(value) { _" + col.Name + " = value; }, " +
								"enumerable: true, " +
								"configurable: false " +
							"}); "
					});

					return new Function(rtStr);
				}

				var CreateClass = function()
				{
					self.Row = ClassFactory();
				}
				Object.defineProperty(self, 'CreateClass', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: CreateClass
				});

				name = data.Name;
			}
		
			Table.prototype.version = '1.0'
		
			// Return Constructor
			return Table;
		})();
		DataContextBase.Table = Table;


		var Column = (function(undefined){
			/**
			 * Column constructor.
			 * @constructor
			 */
			var Column = function Column(data)
			{
				if(!(this instanceof Column))
					return new Column(data);
				
				var self = this;
				data = data || {};
				
				/**
				 *	@define {string}
				 */
				var name;
				Object.defineProperty(self, 'Name',{
					get: function()
					{
						return name;
					},
					set: function(value)
					{
						name = value;
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {string}
				 */
				var type;
				Object.defineProperty(self, 'Type',{
					get: function()
					{
						return type;
					},
					set: function(value)
					{
						type = value;
					},
					enumerable: true,
					configurable: false
				});

				name = data.Name;
				type = data.Type;
			}
		
			Column.prototype.version = '1.0'
		
			// Return Constructor
			return Column;
		})();
		DataContextBase.Column = Column;



		return DataContextBase;
	});
})();