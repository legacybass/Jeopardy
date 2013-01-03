/*		Settings JavaScript Module
 *		Author: Daniel Beus
 *		Date: 11/9/2012
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
			factory(window['Settings'] = {});
		}
	})(function(SettingsExports)
	{
		var Settings = typeof SettingsExports !== Types.Undefined ? SettingsExports : {};

		// Start Settings module code here
		// Any publicly accessible methods should be attached to the "Settings" object created above
		// Any private functions or variables can be placed anywhere

		/**
		 *
		 */
		var AbstractSettings = (function(undefined){
			/**
			 * AbstractSettings constructor.
			 * @constructor
			 */
			var AbstractSettings = function(data)
			{
				if(!(this instanceof AbstractSettings))
					return new AbstractSettings(data);
				
				var self = this;
				

			}
			

			AbstractSettings.prototype.version = '1.0'
		
			// Return Constructor
			return AbstractSettings;
		})();


		var JeopardyGameSettings = (function(undefined){
			/**
			 * JeopardyGameSettings constructor.
			 * @constructor
			 * @extends AbstractSettings
			 */
			var JeopardyGameSettings = function(data)
			{
				if(!(this instanceof JeopardyGameSettings))
					return new JeopardyGameSettings(data);
				
				var self = this;

				var isConnectedGame;
				Object.defineProperty(self, 'ConnectedGame',{
					get: function()
					{
						return isConnectedGame;
					},
					set: function(value)
					{
						isConnectedGame = !!value;
					},
					enumerable: true,
					configurable: false
				});
				
				var requiredCategories;
				Object.defineProperty(self, 'RequiredCategories',{
					get: function()
					{
						return requiredCategories;
					},
					set: function(value)
					{
						if(!Array.isArray(value))
							throw new TypeError("Value " + value + " is not an array.");

						requiredCategories = value;
					},
					enumerable: true,
					configurable: false
				});


			}
		
			// Inherit from another class
			JeopardyGameSettings.prototype = new AbstractSettings();
		
			JeopardyGameSettings.prototype.version = '1.0'
		
			// Return Constructor
			return JeopardyGameSettings;
		})();

		var DataManagementSettings = (function(undefined){
			/**
			 * DataManagementSettings constructor.
			 * @constructor
			 * @implements AbstractSettings
			 */
			var DataManagementSettings = function(data)
			{
				if(!(this instanceof DataManagementSettings))
					return new DataManagementSettings(data);
				
				var self = this;
				
			}
		
			// Inherit from another class
			DataManagementSettings.prototype = new AbstractSettings(); 
		
			DataManagementSettings.prototype.version = '1.0'
		
			// Return Constructor
			return DataManagementSettings;
		})();

		return Settings;
	});
})();