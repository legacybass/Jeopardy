/*		AnswerWindowViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 2/3/2013
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
			factory(window['AnswerWindowViewModel'] = {});
		}
	})(function(AnswerWindowViewModelExports)
	{
		var AnswerWindowViewModel = typeof AnswerWindowViewModelExports !== Types.Undefined ? AnswerWindowViewModelExports : {};

		// Start AnswerWindowViewModel module code here
		// Any publicly accessible methods should be attached to the "AnswerWindowViewModel" object created above
		// Any private functions or variables can be placed anywhere

		

		return AnswerWindowViewModel;
	});
})();