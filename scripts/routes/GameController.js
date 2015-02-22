import ko from 'knockout';

// Get handler for Game/Setup
export function Setup(context) {
	if(!context.app.CheckValidUser())
	{
		context.session('redirect', '#/Game/Setup');
		context.redirect('#/Home/Login');
		return;
	}

	require(['viewmodels/Game/SetupViewModel', 'text!Views/Templates/Game/Setup.html!strip'], function ($__1, $__2) {
		if(!$__1 || !$__1.__esModule)
			$__1 = { default: $__1 };
		if(!$__2 || !$__2.__esModule)
			$__2 = { default: $__2 };
		var viewModel = $__1.default;
		var index = $__2.default;

		var viewmodel = new viewModel({
			userId: context.session('user', () => '-1')
		});

		context.app.swap(index);

		ko.applyBindings(viewmodel, context.$element().children('#Setup')[0]);
	});
}

// Get handler for Game/Play
export function Play(context) {
	if(!context.app.CheckValidUser())
	{
		context.session('redirect', '#/Game/Setup');
		context.redirect('#/Home/Login');
		return;
	}
	
	require(['viewmodels/Game/PlayViewModel', 'text!Views/Templates/Game/Play.html!strip'], function ($__1, $__2) {
		if(!$__1 || !$__1.__esModule)
			$__1 = { default: $__1 };
		if(!$__2 || !$__2.__esModule)
			$__2 = { default: $__2 };
		var viewModel = $__1.default;
		var game = $__2.default;

		context.app.swap(game);

		var onlineGame = context.params['OnlineGame'] == "on";

		if(onlineGame)
		{
			// Find some way of switching out the dataaccess layer if online versus local
			// Will also need to switch the socket logic so it doesn't break
		}

		var viewModel = new viewModel({
			Name: context.params['GameName'] ? context.params["GameName"].trim() : '',
			ChosenCategories: context.params['ChosenCategories'],
			questionCount: context.params['QuestionCounter'],
			contestantCount: context.params['ContestantCounter'],
			Online: onlineGame,
			Userid: context.session('user', () => '-1')
		});
		ko.applyBindings(viewModel, context.$element().children('#Game')[0]);
	});
}
