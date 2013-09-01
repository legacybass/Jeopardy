/*		DataManagementWebDataContext JavaScript Module
 *		Author: Daniel Beus
 *		Date: 8/10/2013
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

	(function(root, factory)
	{
		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var target = module['exports'] || exports;
			var jQuery = require('jquery');
			factory(target, jQuery);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'jquery'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(root['DataManagementWebDataContext'] = {},
				root['jQuery']);
		}
	})(this, function(DataManagementWebDataContextExports, jQuery)
	{
		var DataManagementWebDataContext = typeof DataManagementWebDataContextExports !== Types.Undefined ? DataManagementWebDataContextExports : {};

		// Start DataManagementWebDataContext module code here
		// Any publicly accessible methods should be attached to the "DataManagementWebDataContext" object created above
		// Any private functions or variables can be placed anywhere

		var DataContext = (function(undefined){
			/**
			 * DataContext constructor.
			 * @constructor
			 */
			var DataContext = function DataContext(data)
			{
				if(!(this instanceof DataContext))
					return new DataContext(data);
				
				var self = this;
				data = data || {};
				
				/*	Get Tables
				 *	Params Descriptions
				 */
				function GetTables(callback)
				{
					jQuery.ajax({
						url: '/Data/GetTables'
					})
					.done(function (response, status, request)
					{
						/* Response should be an object with the following properties:
						 * Response: {
						 *		Error: Information about any potential errors
						 *		Tables: [{
						 *			Name: Table name
						 *			ColumnNames: Names of the columns
						 *			Rows: The rows of data using the column names as keys
						 *		}]
						 *	}
						 */

						if(response.Error)
						{
							callback("Failed to retrieve data. " + Error);
						}
						else
						{
							if(response.Tables)
							{
								response.Tables.forEach(function(item)
								{
									item.Records.forEach(function(record)
									{
										if(!record.ID && record._id)
											record.ID = record._id;
									});
								});
								callback(false, response.Tables);
							}
							else
								callback("No data returned from server.");
						}
					})
					.fail(function (request, status, error)
					{
						callback("Failed to communicate with server. " + error);
					});
				}
				Object.defineProperty(self, 'GetTables', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetTables
				});


				/*	Get Tables
				 *	Params Descriptions
				 */
				function InsertRow(tableName, row, callback)
				{
					jQuery.ajax({
						url: '/Data/InsertRow',
						data: {
							tableName: tableName,
							row: row
						}//,
						//type: 'POST'
					})
					.done(function (response, status, request)
					{
						if(response.Error)
						{
							callback(response.Error);
						}
						else
						{
							if(response.Row)
							{
								if(!response.Row.ID && response.Row._id)
									response.Row.ID = response.Row._id;

								response.Row.ForeignKeys = response.ForeignKeys;
								callback(undefined, response.Row);
							}
							else
								callback("No data returned from server.");
						}
					})
					.fail(function (request, status, error)
					{
						callback('Could not contact server. ' + error);
					});
				}
				Object.defineProperty(self, 'InsertRow', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: InsertRow
				});

				/*	Get Tables
				 *	Params Descriptions
				 */
				function DeleteRow(table, rowID, callback)
				{
					jQuery.ajax({
						url: '/Data/DeleteRow',
						data: {
							tableName: table,
							rowID: rowID
						}
					})
					.done(function (response, status, request)
					{
						if(response.Error)
						{
							callback('Could not delete row. ' + response.Error);
						}
						else
						{
							callback(undefined, response.Row);
						}
					})
					.fail(function (request, status, error)
					{
						callback('Could not contact server. ' + error);
					});
				}
				Object.defineProperty(self, 'DeleteRow', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: DeleteRow
				});

				/*	Get Tables
				 *	Params Descriptions
				 */
				function UpdateRow(table, row, callback)
				{
					jQuery.ajax({
						url: '/Data/UpdateRow',
						data: {
							tableName: table,
							row: row
						}
					})
					.done(function (response, status, request)
					{
						if(response.Error)
						{
							callback("Could not update row. " + response.Error);
						}
						else
						{
							if(response.Row)
								callback(undefined, response.Row);
							else
								callback("Did not receive data from server.");
						}
					})
					.fail(function (request, status, error)
					{
						callback("Could not contact server. " + error);
					});
				}
				Object.defineProperty(self, 'UpdateRow', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: UpdateRow
				});

				/*	Insert or update a row
				 *	@param {string} table The name of the table
				 *	@param {object} row The information in the row to save
				 *	@param {function} callback Function to call when all is done
				 */
				function SaveChanges(table, row, callback)
				{
					if(row.ID)
						UpdateRow(table, row, callback);
					else
						InsertRow(table, row, callback);
				}
				Object.defineProperty(self, 'SaveChanges', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: SaveChanges
				});

				/*	Get Tables
				 *	Params Descriptions
				 */
				function ExportDB(callback)
				{
					jQuery.ajax({
						url: '/Data/ExportDB'
					})
					.done(function (response, status, request)
					{

					})
					.fail(function (request, status, error)
					{

					})
					.always(function (request, status, error)
					{
						alert("ExportDB not yet implemented.");
					});
				}
				Object.defineProperty(self, 'ExportDB', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: ExportDB
				});

				/*	Get Tables
				 *	Params Descriptions
				 */
				function ImportDB(callback)
				{
					jQuery.ajax({
						url: '/Data/ImportDB'
					})
					.done(function (response, status, request)
					{

					})
					.fail(function (request, status, error)
					{

					})
					.always(function (request, status, error)
					{
						alert("ImportDB not yet implemented.");
					});
				}
				Object.defineProperty(self, 'ImportDB', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: ImportDB
				});
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();
		DataManagementWebDataContext.DataContext = DataContext;
		

		return DataManagementWebDataContext;
	});
})();