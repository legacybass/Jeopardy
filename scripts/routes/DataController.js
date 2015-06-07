import ko from 'knockout';

export function Manage(context) {
	if(!context.app.CheckValidUser())
	{
		context.session('redirect', '#/Data/Manage');
		context.redirect('#/Home/Login');
		return;
	}

	require(['viewmodels/Data/ManageViewModel', 'text!Views/Templates/Data/Manage.html!strip'], (ViewModel, template) => {
		var vm = new ViewModel({ userid: context.session('user', () => '1' ) });
		context.app.swap(template);

		ko.applyBindings(vm, context.$element().children('#Manage')[0]);
	});
}
