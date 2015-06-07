var express = require('express')
	, http = require('http')
	, path = require('path')
	, mongoose = require('mongoose')
	, fs = require('fs');

exports.boot = function(callback)
{
	var app = express();

	var startup = [
		BootApplication,
		BootModels,
		BootControllers
	];

	function next() {
		var step = startup.shift();

		if(step)
			step(app, next);
		else
			callback(app);
	}

	next();

	return app;
}

// Setup any server configurations
function BootApplication(app, next)
{
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.use("/public", express.static(path.join(__dirname, 'public')));
	app.use('/Views/Templates', express.static(path.join(__dirname, 'Views/Templates')));

	app.set('views', __dirname + '/Views');
	app.set('view engine', 'jade');
	app.engine('jade', require('jade').__express);

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser('legacybass'));
	app.use(express.session());

	if(app.get('env') == 'development')
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-dev');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}
	else if(app.get('env') == 'production')
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy');
		app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
	}
	else if(app.get('env') == 'test')
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-test');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}

	next();
}

// Load the controllers into the routing domain
function BootControllers(app, next)
{
	// routing
	var homeController = require('./Controllers/HomeController');
	var apiController = require('./Controllers/ApiController');

	app.use(app.router);

	apiController(app);
	homeController(app);

	next();
}

// Load the models into the mongoose framework
function BootModels(app, next)
{
	fs.readdir('./Schemas', function(err, files)
	{
		if(err)
			throw err;

		files.forEach(function(file)
		{
			var name = file.replace(".js", ""),
				schema = require("./Schemas/" + name);
			mongoose.model(name, schema);
		});

		mongoose.connect(app.get('db-uri'));
		var db = mongoose.connection;
		db.on('error', function() {
			var message = ['connection error:'];
			Array.prototype.map.call(arguments, function(item) { message.push(item); });
			console.error.apply(console, message);
		});
		db.once('open', function()
		{
			next();
		});
	});
}

// Load the socket configurations and handlers
function BootSockets(server)
{
	require('./Controllers/SocketController')(server);
}

var app = exports.boot(function(app) {
	var server = http.createServer(app);
	server.listen(app.get('port'), function(){
		console.log('Express server listening on port %d.', app.get('port'));
	});
	BootSockets(server);
});
