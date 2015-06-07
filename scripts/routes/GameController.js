import ko from 'knockout';

// Get handler for Game/Setup
export function Setup(context) {
	if(!context.app.CheckValidUser())
	{
		context.session('redirect', '#/Game/Setup');
		context.redirect('#/Home/Login');
		return;
	}

	require(['viewmodels/Game/SetupViewModel', 'text!Views/Templates/Game/Setup.html!strip'], function (ViewModel, template) {
		var viewmodel = new ViewModel({
			userId: context.session('user', () => '-1')
		});

		context.app.swap(template);

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
	
	require(['viewmodels/Game/PlayViewModel', 'text!Views/Templates/Game/Play.html!strip'], function (ViewModel, template) {
		context.app.swap(template);

		var onlineGame = context.params['OnlineGame'] == "on";

		if(onlineGame)
		{
			// Find some way of switching out the dataaccess layer if online versus local
			// Will also need to switch the socket logic so it doesn't break
		}

		var viewModel = new ViewModel({
			Name: context.params['GameName'] ? context.params["GameName"].trim() : '',
			ChosenCategories: context.params['ChosenCategories'],
			questionCount: context.params['QuestionCounter'],
			contestantCount: context.params['ContestantCounter'],
			Online: onlineGame,
			Userid: context.session('user', () => '-1')
		});
		ko.applyBindings(viewModel, context.$element().children('#Game')[0]);

		window.addEventListener('unload', () => viewModel.NavigateAway());
	});
}
