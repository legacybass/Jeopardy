import ko from 'knockout';
import ErrorHandler from 'errorhandler';
import * as dataAccess from 'dataaccess';

var errorHandler = new ErrorHandler();

export function Page (context, name) {
	require(['viewmodels/Home/' + name + 'ViewModel', 'text!Views/Templates/Home/' + name + '.html!strip'], (ViewModel, template) => {
		var viewmodel = new ViewModel({});

		context.app.swap(template);

		ko.applyBindings(viewmodel, context.$element().children('#' + name)[0]);
	});
}

export function Login (context) {
	var redirect = context.session('redirect') || '#/',
		username = context.params['username'],
		password = context.params['password'];

	context.clearSession();

	dataAccess.UserLogin(username, password)
	.then((info) => {
		if(info.error) {
			console.log(info.message);
			errorHandler.Show({ message: 'Either your username or password are not registered in the database.', title: 'Invalid Username or Password'});
		}
		else
		{
			context.session('user', info.user);
			var now = new Date(Date.now());
			now.setDate(now.getDate() + 2);
			this.session('timeout', now);

			context.redirect(redirect);
		}
	},
	(err) => {
		console.log(err);
		errorHandler.Show({ message: 'Either your username or password are not registered in the database.', title: 'Invalid Username or Password' });
	});
}

export function Register (context) {
	if(context.params['valid'] == "false")
		return;

	dataAccess.UserRegister(context.params['username'], context.params['password'])
	.then((info) => {
		if(info.error) {
			console.log(info.message);
			errorHandler.Show({ message: info.message, title: 'Could Not Create User'});
		}
		else
		{
			context.redirect('#/');
			errorHandler.Show({ title: 'User successfully created.', level: 'success', message: '' });
		}
	},
	(err) => {
		console.log(err);
		errorHandler.Show({ message: err, title: 'Could Not Create User'});
	});
}
