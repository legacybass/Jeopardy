import ko from 'knockout';

export function Login (context) {
	require(['viewmodels/Contestant/LoginViewModel', 'text!Views/Templates/Contestant/Login.html!strip'], function ($__0, $__1) {
		if(!$__0 || !$__0.__esModule)
			$__0 = { default: $__0 };
		if(!$__1 || !$__1.__esModule)
			$__1 = { default: $__1 };
		var viewmodel = $__0.default;
		var html = $__1.default;

		var vm = new viewmodel({ });
		context.app.swap(html);
		ko.applyBindings(vm, context.$element().children('#Login')[0]);
	});
}