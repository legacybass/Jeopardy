/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, mongoose = require('mongoose')
	, fs = require('fs');

//process.env.NODE_ENV = 'production';
var debugmode = true;

exports.boot = function(params)
{
	var app = express();
	
	BootApplication(app);
	BootModels(app);
	BootControllers(app);

	return app;
}

exports.cache = {};

function RenderPage(path, options, fn)
{
	console.log("Path:", path, "\nOptions:", options);
	if(typeof options == 'function')
	{
		fn = options;
		options = undefined;
	}

	if(typeof fn === 'function')
	{
		var res;
		try
		{
			res = RenderPage(path, options);
		}
		catch(ex)
		{
			return fn(ex);
		}

		return fn(null, res);
	}

	options = options || {};
	var key = path + ':string';

	options.filename = path;
	var str = options.cache
				? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
				: fs.readFileSync(path, 'utf8');
	return str;
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
		app.set('db-uri', 'mongodb://jeopardy:T!k^BGFss5kD@ds053178.mongolab.com:53178/heroku_app19032439');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('test', function()
	{
		app.set('db-uri', 'mongodb://localhost/jeopardy-test');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.use(app.router);
	global.locals = { };

	if(debugmode || 'production' != app.get('env'))
	{
		global.locals.DebugLog = function (str)
		{
			if(arguments.caller)
				str = arguments.caller + " says: " + str;

			console.log(str);
		}
	}
	else
	{
		global.locals.DebugLog = function() { };
	}
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
