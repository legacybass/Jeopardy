/*		HelperFunctions JavaScript Module
 *		Author: Daniel Beus
 *		Date: 10/18/2012
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
			var shim = module['shim'];
			var sham = module['sham'];
			factory(target, shim, sham);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			define(['exports', 'shim', 'sham'], factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			factory(window['Extensions'] = {},
				window['es5-shim'],
				window['es5-sham']);
		}
	})(function(HelperFunctionsExports, shim, sham)
	{
		var HelperFunctions = typeof HelperFunctionsExports !== Types.Undefined ? HelperFunctionsExports : {};

		if(!String.prototype['IsNullOrWhitespace'])
		{
			function IsNullOrWhitespace()
			{
				var origStr = this;
				
				if(origStr == null || origStr == undefined)
					return true;

				var moddedStr = origStr.Trim();

				return moddedStr.length <= 0;
			}

			Object.defineProperty(String.prototype, 'IsNullOrWhitespace',{
				get: function()
				{
					return IsNullOrWhitespace.call(this);
				},
				enumerable: false,
				configurable: false
			});
			
		}

		var Clone = function()
		{
			var rtObj,
				obj = this;

			if(obj instanceof Array)
				rtObj = [];
			else
				rtObj = {}

			for(var key in obj)
			{
				var data = obj[key],
					dataType = typeof data;

				if(dataType === Types.Function && data === Clone)
					continue;

				if(dataType === Types.Object)
				{
					rtObj[key] = data.Clone();
				}
				else
				{
					rtObj[key] = data;
				}
			}

			return rtObj;
		}

		if(!Object.prototype['Clone'])
		{
			Object.defineProperty(Object.prototype, 'Clone', { enumerable: false });
		}

		if(!Array.prototype['Clone'])
		{
			Object.defineProperty(Array.prototype, 'Clone', { enumerable: false });
		}
	});
})();