// // Router module
// // Sets up routes for SPA
import sammy from 'sammy';
import sammyJson from 'libs/sammy.json';
import sammyStorage from 'libs/sammy.storage';
import * as Home from 'HomeController';
import * as Game from 'GameController';
import * as Data from 'DataController';
import * as Contestant from 'ContestantController';

var app = undefined;

export function SetupRoutes(main = '#main') {
	app = sammy(main, function () {
		this.debug = true;

		// Plugins
		this.use('Session');

		
		// Get calls
		// Binds to the address http://{host}/#/
		this.get(/^\/?#\/?$/, ctx => Home.Page(ctx, 'Index'));
		this.get('#/Home/Login', ctx => Home.Page(ctx, 'Login'));
		this.get('#/Home/Register', ctx => Home.Page(ctx, 'Register'));
		this.get('#/Game/Setup', Game.Setup);
		this.get('#/Game/Play', Game.Play);
		this.get('#/Data/Manage', Data.Manage);
		this.get('#/Contestant/Login', Contestant.Login);


		// Post calls
		this.post('#/Home/Login', Home.Login);
		this.post('#/Home/Register', Home.Register);
		this.post('#/Game/Setup', context => context.redirect("#/Game/Play"));
		this.post('#/Game/Play', Game.Play);


		// Delete calls

	});
}

export function Start(startPage = '#/') {
	app.run(startPage);
}

export function Navigate(url = '', data) {
	if(data)
	{
		Post(url, data);
	}
	else
	{
		Get(url);
	}
}

export function Get(url = '') {
	app.runRoute('get', '#/' + url);
}

export function Post(url = '', data = { }) {
	app.runRoute('post', '#/' + url, data);
}

export function Put(url = '', data = { }) {
	app.runRoute('put', '#/' + url, data);
}

export function Delete(url = '', data = { }) {
	app.runRoute('del', '#/' + url, data);
}

