/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, mongoose = require('mongoose')
	, fs = require('fs');


//var app = express();

exports.boot = function(params)
{
	var app = express();
	
	BootApplication(app);
	BootModels(app);
	BootControllers(app);

	return app;
}

// Setup any server configurations
function BootApplication(app)
{
	// all environments
	app.set('port', process.env.PORT || 3000);

	app.set('views', __dirname + '/Views');
	app.set('view engine', 'html');
	app.engine('html', require('jade').__express);


	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser('legacybass'));
	app.use(express.session());

	app.use("/public", express.static(path.join(__dirname, 'public')));
	app.use(app.router);

	app.configure('development', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-dev');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy');
		app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
	});

	app.configure('test', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-test');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
}

// Load the controllers into the routing domain
function BootControllers(app)
{
	// routing
	require(__dirname + '/Controllers/AppController')(app);
}

// Load the models into the mongoose framework
function BootModels(app)
{
	fs.readdir(__dirname + '/Schemas', function(err, files)
	{
		if(err)
			throw err;

		files.forEach(function(file)
		{
			var name = file.replace(".js", ""),
				schema = require(__dirname + "/Schemas/" + name);
			mongoose.model(name, schema);
		});
	});

	mongoose.connect(app.get('db-uri'));
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function()
	{

	});
}

var app = exports.boot();
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port %d.', app.get('port'));
});