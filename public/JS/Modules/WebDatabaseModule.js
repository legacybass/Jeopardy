/*		WebDatabaseModule JavaScript Module
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
			var jquery = require('jquery');
			var extensions = require('Modules/ExtensionsModule');
			factory(target, jquery, extensions);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'jquery', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(root['WebDatabaseModule'] = {},
				root['jQuery']);
		}
	})(this, function(WebDatabaseModuleExports, jQuery)
	{
		var WebDatabaseModule = typeof WebDatabaseModuleExports !== Types.Undefined ? WebDatabaseModuleExports : {};

		// Start WebDatabaseModule module code here
		// Any publicly accessible methods should be attached to the "WebDatabaseModule" object created above
		// Any private functions or variables can be placed anywhere

		var DatabaseInteractions = (function(undefined){
			/**
			 * DatabaseInteractions constructor.
			 * @constructor
			 */
			var DatabaseInteractions = function DatabaseInteractions(data)
			{
				if(!(this instanceof DatabaseInteractions))
					return new DatabaseInteractions(data);
				
				var self = this;
				data = data || {};
				
				function Select(selectArr, whereDict, callback)
				{
					jQuery.ajax({
						url: '/Data/Select',
						data: {
							selectKeys: selectArr,
							where: whereDict
						}
					})
					.done(function (data, status, request)
						{
							if(data.Error)
							{

							}
							else
							{
								callback(data.Rows)
							}
						})
					.fail(function (request, status, error)
						{

						})
					.always(function (request, status, error)
						{

						});
				}
				Object.defineProperty(self, 'Select', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Select
				});

				function Insert()
				{

				}
				Object.defineProperty(self, 'Insert', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Insert
				});

				function Create()
				{

				}
				Object.defineProperty(self, 'Create', {
					enuerable: false,
					configurable: false,
					writable: false,
					value: Create
				});

				function Update()
				{

				}
				Object.defineProperty(self, 'Update', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Update
				});
			}
		
			DatabaseInteractions.prototype.version = '1.0'
		
			// Return Constructor
			return DatabaseInteractions;
		})();

		DatabaseInteractions.DatabaseInteractions = DatabaseInteractions;

		return WebDatabaseModule;
	});
})();