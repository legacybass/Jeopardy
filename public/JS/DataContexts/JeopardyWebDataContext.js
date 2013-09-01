/*		JeopardyWebDataContext JavaScript Module
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
			var exception = require('Modules/ExceptionModule');
			var models = require('Models/JeopardyModels');
			var db = require('Modules/WebDatabaseModule');
			var extensions = require('Modules/ExtensionsModule');
			factory(target, jquery, exception, models, db);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'jquery', 'Modules/ExceptionModule', 'Models/JeopardyModels',
					'Modules/WebDatabaseModule', 'Modules/ExtensionsModule'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(root['JeopardyWebDataContext'] = {},
				root['jQuery'],
				root['ExceptionModule'],
				root['JeopardyModels'],
				root['WebDatabaseModule']);
		}
	})(this, function(JeopardyWebDataContextExports, jQuery, Exceptions, JeopardyModels, db)
	{
		var JeopardyWebDataContext = typeof JeopardyWebDataContextExports !== Types.Undefined ? JeopardyWebDataContextExports : {};

		// Start JeopardyWebDataContext module code here
		// Any publicly accessible methods should be attached to the "JeopardyWebDataContext" object created above
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
				
				var GetQuestions = function(categoryID, callback)
				{
					jQuery.ajax({
						url: '/Game/Questions',
						data: {
							categoryID: categoryID
						}
					})
					.done(function (response, status, request)
						{
							if(response.Error)
							{

							}
							else
							{
								callback(response.Questions);
							}
						})
					.fail(function (request, status, err)
						{

						})
					.always(function (request, status, err)
						{

						});
				}
				Object.defineProperty(self, 'GetQuestions', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetQuestions.bind(self)
				});

				var GetCategories = function(requiredCategories, callback)
				{
					jQuery.ajax({
						url: '/Game/Categories',
						data: {
							requiredCategories: requiredCategories
						}
					})
					.done(function (response, status, request)
						{
							if(response.Error)
							{

							}
							else
							{
								callback(response.Categories);
							}
						})
					.fail(function (request, status, err)
						{

						})
					.always(function (request, status, err)
						{

						});
				}
				Object.defineProperty(self, 'GetCategories', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetCategories.bind(self)
				});

				var GetFinalQuestion = function()
				{
					jQuery.ajax({
						url: '/Game/FinalQuestion',
						data: {
							
						}
					})
					.done(function (response, status, request)
						{
							if(response.Error)
							{

							}
							else
							{
								callback(response.FinalQuestion);
							}
						})
					.fail(function (request, status, err)
						{

						})
					.always(function (request, status, err)
						{

						});
				}
				Object.defineProperty(self, 'GetFinalQuestion', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetFinalQuestion.bind(self)
				})
			}
		
			DataContext.prototype.version = '1.0'
		
			// Return Constructor
			return DataContext;
		})();
		JeopardyWebDataContext.DataContext = DataContext;

		return JeopardyWebDataContext;
	});
})();