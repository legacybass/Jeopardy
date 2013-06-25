require(['ViewModels/ContestantViewModel', 'knockout', 'domReady'], function(cvm, ko)
{
	var viewModel = new cvm.ContestantViewModel();
	/* #DEBUG */ if(typeof debug != typeof undefined) window['viewmodel'] = viewModel;
	ko.applyBindings(viewModel);
});