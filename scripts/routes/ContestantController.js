import ko from 'knockout';

export function Login (context) {
	require(['viewmodels/Contestant/LoginViewModel', 'text!Views/Templates/Contestant/Login.html!strip'], function (ViewModel, template) {
		var vm = new ViewModel({ });
		context.app.swap(template);
		ko.applyBindings(vm, context.$element().children('#Login')[0]);
	});
}

export function Play (context) {
	require(['viewmodels/Contestant/PlayViewModel', 'text!Views/Templates/Contestant/Play.html!strip'], function (ViewModel, template) {
		var vm = new ViewModel({
			gameId: context.params['gameId'],
			contestantId: context.params['contestantId'] ? context.params['contestantId'].trim() : '',
			contestantName: context.params['contestantName'] ? context.params['contestantName'].trim() : ''
		});
		context.app.swap(template);
		ko.applyBindings(vm, context.$element().children('#Play')[0]);
	})
}