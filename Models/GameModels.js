/*		JeopardyGameModels JavaScript Module
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
		var requirements = ['linq'];


		// Support three module loading scenarios
		// Taken from Knockout.js library
		if(typeof require === Types.Function && typeof exports === Types.Object && typeof module === Types.Object)
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
			var mods = [root['JeopardyGameModels'] = {}, root['module']];

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
	})(this, function(JeopardyGameModelsExports, module, linq)
	{
		var JeopardyGameModels = typeof JeopardyGameModelsExports !== Types.Undefined ? JeopardyGameModelsExports : {};
		var moduleData = {};
		if(module && typeof module.config === 'function')
			moduleData = module.config().data || {};

		// Start JeopardyGameModels module code here
		// Any publicly accessible methods should be attached to the "JeopardyGameModels" object created above
		// Any private functions or variables can be placed anywhere

		var User = (function(undefined){
			/**
			 * User constructor.
			 * @constructor
			 */
			var User = function User(data) {
				if(!(this instanceof User))
					return new User(data);
				
				var self = this
					isLockedOut = false;
				data = data || {};
				
				/**
				 *	@define {number}
				 */
				var score = data.Score;
				Object.defineProperty(self, 'Score',{
					get: function()
					{
						return score;
					},
					set: function(value)
					{
						score = value;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {number}
				 */
				var attempts = data.Attempts;
				Object.defineProperty(self, 'Attempts',{
					get: function()
					{
						return attempts;
					},
					set: function(value)
					{
						attempts = value;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {string}
				 */
				var username = data.Username;
				Object.defineProperty(self, 'Username',{
					get: function()
					{
						return username;
					},
					set: function(value)
					{
						username = value;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {object}
				 */
				var socket = data.Socket;
				Object.defineProperty(self, 'Socket',{
					get: function()
					{
						return socket;
					},
					set: function(value)
					{
						socket = value;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {string}
				 */
				var wnumber = data.WNumber;
				Object.defineProperty(self, 'WNumber',{
					get: function()
					{
						return wnumber;
					},
					set: function(value)
					{
						wnumber = value;
					},
					enumerable: true,
					configurable: true
				});

				Object.defineProperty(self, 'IsLockedOut', {
					get: function() { return isLockedOut; },
					enumerable: true,
					configurable: false
				});

				Object.defineProperty(self, 'HasAnswered', {
					enumerable: true,
					configurable: false,
					writable: true,
					value: false
				});

				/**
				 *	@define {number}
				 */
				var numberOfConnections = 1;
				Object.defineProperty(self, 'NumberOfConnections', {
					get: function()
					{
						return numberOfConnections;
					},
					set: function(value)
					{
						numberOfConnections = value;
					},
					enumerable: true,
					configurable: false
				});

				function LockOut()
				{
					isLockedOut = true;
					setTimeout(function() { isLockedOut = false; }, 1000);
				}
				Object.defineProperty(self, 'LockOut', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: LockOut
				});
			}

			User.prototype.version = '1.0'
		
			// Return Constructor
			return User;
		})();
		JeopardyGameModels.User = User;

		var Game = (function(undefined){
			/**
			 * Game constructor.
			 * @constructor
			 */
			var Game = function Game(data)
			{
				if(!(this instanceof Game))
					return new Game(data);
				
				var self = this
					, lastUser;
				data = data || {};
				
				/**
				 *	@define {array}
				 */
				var users = [];
				Object.defineProperty(self, 'Users',{
					get: function()
					{
						return users;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {object}
				 */
				var host = data.Host;
				Object.defineProperty(self, 'Host',{
					get: function()
					{
						return host;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {string}
				 */
				var name = data.Name;
				Object.defineProperty(self, 'Name',{
					get: function()
					{
						return name;
					},
					set: function(value)
					{
						name = value;
					},
					enumerable: true,
					configurable: false
				});

				/**
				 *	@define {string}
				 */
				var hash = data.Hash;
				Object.defineProperty(self, 'Hash',{
					get: function()
					{
						return hash;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {boolean}
				 */
				var isLocked = data.IsLocked;
				Object.defineProperty(self, 'IsLocked',{
					get: function()
					{
						return isLocked;
					},
					set: function(value)
					{
						isLocked = value;
					},
					enumerable: true,
					configurable: true
				});

				/**
				 *	@define {object}
				 */
				var lastUser;
				Object.defineProperty(self, 'LastUser',{
					get: function()
					{
						return lastUser;
					},
					set: function(value)
					{
						if(users.indexOf(value) >= 0)
							lastUser = value;
					},
					enumerable: true,
					configurable: true
				});

				/*	Add a user to the array
				 *	@param {Object} user Info about the new user
				 */
				function AddUser(userData)
				{
					return users.push(new User({
						  Username: userData.Username
						, Socket: userData.Socket
						, Score: userData.Score
						, Attempts: userData.Attempts
						, WNumber: userData.WNumber
					}));
				}
				Object.defineProperty(self, 'AddUser', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: AddUser
				});

				/*	Remove a user
				 *	@param {Number} index The index of the user in the array
				 */
				function RemoveUser(index)
				{
					return users.splice(index, 1);	
				}
				Object.defineProperty(self, 'RemoveUser', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: RemoveUser
				});

				function FindUserByUsername(username)
				{
					if(!username)
						return undefined;

					var user = linq.from(users)
								.where(function(x) { 
									if(!x.Username)
										return false;

									return x.Username.toLowerCase() === username.toLowerCase();
								})
								.singleOrDefault(undefined);
					return user;
				}
				Object.defineProperty(self, 'FindUserByUsername', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: FindUserByUsername
				});

				function FindUserByID(userID)
				{
					return users[userID];
				}
				Object.defineProperty(self, 'FindUserByID', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: FindUserByID
				});

				/*	Find a given user's id
				 */
				function GetUserId(user)
				{
					return users.indexOf(user);
				}
				Object.defineProperty(self, 'GetUserId', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: GetUserId
				});
			}
		
			Game.prototype.version = '1.0'
		
			// Return Constructor
			return Game;
		})();
		JeopardyGameModels.Game = Game;

		return JeopardyGameModels;
	});
})();