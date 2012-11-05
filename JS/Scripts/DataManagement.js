require(['ViewModels/DataManagementViewModel', 'knockout', 'domReady'], function(vm, ko)
{
	var viewModel = new vm.DataManagementViewModel();
	/* #DEBUG# */ if(typeof debug != typeof undefined) window['viewmodel'] = viewModel;
	viewModel.LoadDatabase('Jeopardy', '1.0', 'Database for holding Jeopardy Questions');
	ko.applyBindings(viewmodel);
});