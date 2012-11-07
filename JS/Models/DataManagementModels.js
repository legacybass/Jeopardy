/*		DataManagementModels JavaScript Module
 *		Author: Daniel Beus
 *		Date: 11/5/2012
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
			var knockout = require('knockout');
			var extensions = require('Modules/ExtensionsModule');

			factory(target, knockout, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'knockout', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['DataManagementModels'] = {}, 
				window['ko'],
				window['Extensions']);
		}
	})(function(DataManagementModelsExports, ko, Extensions)
	{
		var DataManagementModels = typeof DataManagementModelsExports !== Types.Undefined ? DataManagementModelsExports : {};

		
		// Start DataManagementModels module code here
		// Any publicly accessible methods should be attached to the "DataManagementModels" object created above
		// Any private functions or variables can be placed anywhere

		var Column = (function(undefined){
			// public API -- Constructor
			var Column = function(data)
			{
				if(!(this instanceof Column))
					return new Column(data);
				
				var self = this;
				data.props = data.props.toLowerCase();
				
				var name;
				Object.defineProperty(self, 'Name',{
					get: function()
					{
						return name;
					},
					enumerable: true,
					configurable: false
				});

				var required;
				Object.defineProperty(self, 'IsRequired',{
					get: function()
					{
						return required === true;
					},
					enumerable: true,
					configurable: false
				});

				var primaryKey;
				Object.defineProperty(self, 'IsPrimaryKey',{
					get: function()
					{
						return primaryKey === true;
					},
					enumerable: true,
					configurable: false
				});

				var foreignKey;
				Object.defineProperty(self, 'IsForeignKey',{
					get: function()
					{
						return foreignKey === true;
					},
					enumerable: true,
					configurable: false
				});

				var hasDefault;
				Object.defineProperty(self, 'HasDefault',{
					get: function()
					{
						return hasDefault;
					},
					enumerable: true,
					configurable: false
				});

				var writable;
				Object.defineProperty(self, 'Writable',{
					get: function()
					{
						return writable;
					},
					enumerable: true,
					configurable: false
				});

				name = data.name;
				primaryKey = data.props.indexOf('primary key') >= 0;
				foreignKey = data.props.indexOf('foreign key') >= 0;
				hasDefault = data.props.indexOf('default') >= 0;
				required = data.props.indexOf('not null') >= 0 && !primaryKey;
				writable = !primaryKey;

				self.toString = function()
				{
					return name;
				}
			}
		
			Column.prototype.version = '1.0'
		
			// Return Constructor
			return Column;
		})();


		DataManagementModels.Table = (function(undefined){
			function Remove(item)
			{
				var self = this;
				self.Records.remove(item);
			}

			function Add(objFactory, item)
			{
				var self = this;
				var newRow = new objFactory(item);
				self.Records.push(newRow);
				return newRow;
			}

			function RowObjFactory(data)
			{
				var func = "var self = this; ";
				
				data.forEach(function(item)
				{
					//func += "self." + item.toLowerCase() + " = ko.observable(data." + item + "); ";

					func += "self." + item.Name.toLowerCase() + " = { ";
					func += "Writable: " + item.Writable + ", ";
					func += "Data: ko.observable(data." + item.Name + ")";
					func += "}; ";
				});

				func += "self.IsEditing = ko.observable(false); ";

				return (new Function("ko", "data", func)).bind(this, ko);
			}

			// public API -- Constructor
			var Table = function(data)
			{
				if(!(this instanceof Table))
					return new Table(data);

				var self = this,
					objFactory,
					columnData = [];

				self.Name = ko.observable(data.name);
				self.Records = ko.observableArray();
				self.Columns = [];

				data.columns.forEach(function(item)
				{
					var col = new Column(item);
					columnData.push(col);
					self.Columns.push(col.Name);
				});

				objFactory = RowObjFactory(columnData);

				self.Remove = Remove.bind(self);
				self.Add = Add.bind(self, objFactory);
				self.ColumnData = columnData;

				for(var key in data.records)
				{
					var obj = data.records[key];
					self.Add(obj);
				}
			}
		
			Table.prototype.version = '1.0'
		
			// Return Constructor
			return Table;
		})();

		return DataManagementModels;
	});
})();