var fs = require('fs'),
	extensions = require('../public/js/Modules/ExtensionsModule');

module.exports = function(app)
{
	app.get("/:controller?", router);
	app.get("/:controller.:format?", router);
	app.get("/:controller/:from-:to.:format?", router);

	app.post("/:controller", router);
	app.del("/:controller", router);

	app.get("/:controller/:action", router);
	app.post("/:controller/:action", router);
	app.put("/:controller/:action", router);
	app.del("/:controller/:action", router);

	app.get("/:controller/:action/:id.:format?", router);
	app.post("/:controller/:action/:id", router);
	app.put("/:controller/:action/:id", router);
	app.del("/:controller/:action/:id", router);
}

function router(req, res, next)
{
	var controller = req.params.controller ? req.params.controller : '';
	var action = req.params.action ? req.params.action : '';
	var id = req.params.id ? req.params.id : '';
	var method = req.method.toLowerCase();

	console.log('Controller: ' + (controller || '"NO CONTROLLER"') + '\n' +
		'Action: ' + (action || '"NO ACTION"') + '\n' +
		'Id: ' + (id || '"NO ID"') + '\n' +
		'Method: ' + (method || '"NO METHOD"'));

	// set the default action
	var fn = 'index';

	// default route
	if(controller.length == 0)
	{
		// Change to different controller if a different default is desired
		controller = "Home";
	}

	if(controller == "public")
	{
		console.log("Sending file");
		res.sendfile(__dirname + req.path);
		return;
	}

	if(action.length == 0)
	{
		switch(method)
		{
			case 'get':
				fn = 'index';
				break;
			case 'post':
				fn = 'create';
				break;
			case 'delete':
				fn = 'destroyAll';
				break;
		}
	}
	else
	{
		switch(method)
		{
			case 'get':
				if(isNaN(action))
					fn = action;
				else
					fn = 'show';
				break;
			case 'put':
				fn = 'edit';
				break;
			case 'delete':
				fn = 'destroy';
				break;
		}
	}

	fn = fn.Capitalize();
	var controllerPath = './' + controller.Capitalize() + 'Controller';
	// console.log('Looking up ' + controllerPath + ' for ' + fn);
	try
	{
		var controllerLibrary = require(controllerPath);
		if(typeof controllerLibrary[fn] === 'function')
			controllerLibrary[fn](req, res, next);
		else
			res.render('404');
	}
	catch (ex)
	{
		console.log(ex);
		res.render('404');
	}
}