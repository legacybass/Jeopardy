/*		AnswerWindowViewModel JavaScript Module
 *		Author: Daniel Beus
 *		Date: 9/1/2013
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
		var requirements = ['knockout', 'Modules/ExtensionsModule'];


		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof model === Types.Object)
		{
			// [1] CommonJS/Node.js
			var mods = [module['exports'] || exports, require('module')];
			
			for(var key in requirements)
			{
				var data = requirements[key];
				if(typeof data === Types.String)
					mods.push(require(data));
			}

			factory.apply(root, mods);
		}
		else if(typeof define === Types.Function && define['amd'])
		{
			// [2] AMD anonymous module
			var reqs = ['exports', 'module'].concat(requirements);
			define(reqs, factory);
		}
		else
		{
			// [3] No module loader (plain <script> tag) - put directly in global namespace
			var mods = [root['AnswerWindowViewModel'] = {}, root['module']];

			for(var key in requirements)
			{
				var data = requirements[key];
				if(typeof data === Types.String)
				{
					var parts = data.split('/');
					mods.push(window[parts[parts.length - 1]]);
				}
			}

			factory.apply(root, mods);
		}
	})(this, function(AnswerWindowViewModelExports, module, ko)
	{
		var AnswerWindowViewModel = typeof AnswerWindowViewModelExports !== Types.Undefined ? AnswerWindowViewModelExports : {},
			moduleData = module.config().data;

		// Start AnswerWindowViewModel module code here
		// Any publicly accessible methods should be attached to the "AnswerWindowViewModel" object created above
		// Any private functions or variables can be placed anywhere

		var ViewModel = (function(undefined){
			/**
			 * ViewModel constructor.
			 * @constructor
			 */
			var ViewModel = function ViewModel(data)
			{
				if(!(this instanceof ViewModel))
					return new ViewModel(data);
				
				var self = this;
				data = data || {};
				
				/**
				 *	@define {string}
				 */
				var Answer = ko.observable();
				Object.defineProperty(self, 'Answer',{
					get: function()
					{
						return Answer;
					},
					set: function(value)
					{
						Answer(value);
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {boolean}
				 */
				var isHidden = ko.observable(false);
				Object.defineProperty(self, 'IsHidden',{
					get: function()
					{
						return isHidden;
					},
					set: function(value)
					{
						isHidden(value);
					},
					enumerable: true,
					configurable: false
				});

				/*	Show the answer on the screen
				 *	@param {string} answer The answer to show
				 */
				function showAnswer(answer)
				{
					if(typeof answer === Types.String)
						Answer(answer);	
					else
						Answer('No answer passed in.');
					isHidden(false);
				}
				Object.defineProperty(self, 'ShowAnswer', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: showAnswer
				});

				/*	Indicated the answer is hidden
				 *	
				 */
				function HideAnswer()
				{
					isHidden(true);
				}
				Object.defineProperty(self, 'HideAnswer', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: HideAnswer
				});
			}
		
			ViewModel.prototype.version = '1.0'
		
			// Return Constructor
			return ViewModel;
		})();

		AnswerWindowViewModel.ViewModel = ViewModel;		

		return AnswerWindowViewModel;
	});
})();