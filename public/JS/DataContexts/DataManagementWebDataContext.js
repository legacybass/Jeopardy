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
				 *		Name: Table name
				 *		ColumnNames: Names of the columns
				 *		Rows: The rows of data using the column names as keys
				 *	}
				 */

				if(response.Error)
				{

				}
				else
				{

				}
			})
			.fail(function (request, status, error)
			{

			})
			.always(function (request, status, error)
			{

			})
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
		function InsertRow(callback)
		{
			jQuery.ajax({
				url: '/Data/InsertRow'
			})
			.done(function (response, status, request)
			{

			})
			.fail(function (request, status, error)
			{

			})
			.always(function (request, status, error)
			{
				
			})
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
		function DeleteRow(callback)
		{
			jQuery.ajax({
				url: '/Data/DeleteRow'
			})
			.done(function (response, status, request)
			{

			})
			.fail(function (request, status, error)
			{

			})
			.always(function (request, status, error)
			{
				
			})
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
		function UpdateRow(callback)
		{
			jQuery.ajax({
				url: '/Data/UpdateRow'
			})
			.done(function (response, status, request)
			{

			})
			.fail(function (request, status, error)
			{

			})
			.always(function (request, status, error)
			{
				
			})
		}
		Object.defineProperty(self, 'UpdateRow', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: UpdateRow
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
				
			})
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
				
			})
		}
		Object.defineProperty(self, 'ImportDB', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: ImportDB
		});

		return DataManagementWebDataContext;
	});
})();