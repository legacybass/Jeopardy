/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, mongoose = require('mongoose')
	, fs = require('fs');


//var app = express();
process.env.NODE_ENV = 'production';
process.env.PORT = '80';

exports.boot = function(params)
{
	var app = express();
	
	BootApplication(app);
	BootModels(app);
	BootControllers(app);

	return app;
}

function RenderPage(path, options, fn)
{
	var key = path + ':string';
	if(typeof options == 'function')
	{
		fn = options;
		options = {};
	}

	try
	{
		var str = options.cache
					? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
					: fs.readFileSync(path, 'utf8');
		fn(null, str);
	}
	catch (err)
	{
		console.log("couldn't render page " + path);
		fn(err);
	}
}

// Setup any server configurations
function BootApplication(app)
{
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.use("/public", express.static(path.join(__dirname, 'public')));

	app.set('views', __dirname + '/Views');
	app.set('view engine', 'html');
	app.engine('html', RenderPage);

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser('legacybass'));
	app.use(express.session());

	app.configure('development', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-dev');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function()
	{
		app.set('db-uri', 'mongodb://jeopardy:T!k^BGFss5kD@ds053178.mongolab.com:53179/heroku_app19032439');
		app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
	});

	app.configure('test', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-test');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.use(app.router);
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

// Load the socket configurations and handlers
function BootSockets(server)
{
	require(__dirname + '/Controllers/SocketController')(server);
}

var app = exports.boot();
var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port %d.', app.get('port'));
});
BootSockets(server);
