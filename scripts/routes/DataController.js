import ko from 'knockout';

export function Manage(context) {
	if(!context.session('user'))
	{
		context.session('redirect', '#/Data/Manage');
		context.redirect('#/Home/Login');
		return;
	}

	require(['viewmodels/Data/ManageViewModel', 'text!Views/Templates/Data/Manage.html!strip'], ($__0, $__1) => {
		if(!$__0 || !$__0.__esModule)
			$__0 = { default: $__0 };
		if(!$__1 || !$__1.__esModule)
			$__1 = { default: $__1 };
		var viewmodel = $__0.default;
		var html = $__1.default;

		var vm = new viewmodel({ userid: context.session('user', () => '1' ) });
		context.app.swap(html);

		ko.applyBindings(vm, context.$element().children('#Manage')[0]);
	});
}
