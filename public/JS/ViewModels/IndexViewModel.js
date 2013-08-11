/*		JeopardyIndexViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 1/20/2013
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
			factory(window['JeopardyIndexViewModel'] = {},
				window['ko'],
				window['Extensions']);
		}
	})(function(JeopardyIndexViewModelExports, ko, extensions)
	{
		var JeopardyIndexViewModel = typeof JeopardyIndexViewModelExports !== Types.Undefined ? JeopardyIndexViewModelExports : {};

		
		// Start JeopardyIndexViewModel module code here
		// Any publicly accessible methods should be attached to the "JeopardyIndexViewModel" object created above
		// Any private functions or variables can be placed anywhere

		var BaseClass = (function(undefined){
			/**
			 * BaseClass constructor.
			 * @constructor
			 */
			var BaseClass = function BaseClass(data)
			{
				if(!(this instanceof BaseClass))
					return new BaseClass(data);
				
				var self = this;
				data = data || {};
				
				var ToPoco = function()
				{
					var rtObj = {};
					for(var key in self)
					{
						var data = self[key];
						if(data.subscribe)
							rtObj[key] = self[key]();
						else rtObj[key] = self[key];
					}
					return rtObj;
				}

				var AsPoco = function()
				{
					var rtObj = {};
					for(var key in self)
					{
						var data = self[key];
						if(data.subscribe)
						{
							var getter = (function(obj)
							{
								return obj();
							}).bind(self, data);
							var setter = (function(obj, value)
							{
								obj(value);
							}).bind(self, data);
							Object.defineProperty(rtObj, key, {
								get: getter,
								set: setter,
								enumerable: true,
								configurable: false
							});
						}
						else
							rtObj[key] = self[key];
					}
					return rtObj;
				}
				Object.defineProperty(self, 'ToPoco', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: ToPoco
				});
				Object.defineProperty(self, 'AsPoco', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: AsPoco
				});
			}
		
			BaseClass.prototype.version = '1.0'
		
			// Return Constructor
			return BaseClass;
		})();

		var ViewModel = (function(undefined){
			/**
			 * ViewModel constructor.
			 * @constructor
			 * @implements {BaseClass}
			 */
			var ViewModel = function ViewModel(data)
			{
				if(!(this instanceof ViewModel))
					return new ViewModel(data);
				
				var self = this;
				data = data || {};
				BaseClass.apply(self, arguments);
				
				/**
				 *	@define {boolean}
				 */
				var online = ko.observable();
				Object.defineProperty(self, 'Online',{
					get: function()
					{
						return online;
					},
					set: function(value)
					{
						online(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {string}
				 */
				var onlineUrl = ko.observable();
				Object.defineProperty(self, 'OnlineUrl',{
					get: function()
					{
						return onlineUrl;
					},
					set: function(value)
					{
						onlineUrl(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {array}
				 */
				var categories = ko.observableArray();
				Object.defineProperty(self, 'Categories',{
					get: function()
					{
						return categories;
					},
					set: function(value)
					{
						categories(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var setupGame = ko.observable();
				Object.defineProperty(self, 'SetupGame',{
					get: function()
					{
						return setupGame;
					},
					set: function(value)
					{
						setupGame(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {number}
				 */
				var timer = ko.observable(10);
				Object.defineProperty(self, 'Timer',{
					get: function()
					{
						return timer;
					},
					set: function(value)
					{
						timer(value);
					},
					enumerable: true,
					configurable: false
				});

				/*	Description
				 *	Params Descriptions
				 */
				function AddCategory()
				{
					categories.push("");
				}
				Object.defineProperty(self, 'AddCategory', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: AddCategory
				});

				/*	Description
				 *	Params Descriptions
				 */
				function Setup()
				{
					setupGame(true);
				}
				Object.defineProperty(self, 'Setup', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: Setup
				});

				/*	Navigate to the Data Management page
				 *	
				 */
				function DataPage()
				{
					window.location = "Views/DataManagement.html";
				}
				Object.defineProperty(self, 'DataPage', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: DataPage
				});

				/*	Description
				 *	Params Descriptions
				 */
				function StartGame()
				{
					window.location = 'Views/Jeopardy.html?' +
						(categories().length > 0 ? categories().ToURLString('categories') : 'categories=') + '&' +
						'onlineUrl=' + (online() ? onlineUrl() : '') + '&' +
						'timer=' + (timer() ? timer() : '');
				}
				Object.defineProperty(self, 'StartGame', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: StartGame
				});
			}
		
			// Inherit from another class
			ViewModel.prototype = new BaseClass; 
		
			ViewModel.prototype.version = '1.0'
		
			// Return Constructor
			return ViewModel;
		})();

		JeopardyIndexViewModel.ViewModel = ViewModel;

		return JeopardyIndexViewModel;
	});
})();