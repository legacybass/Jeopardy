require(['jquery', 'ViewModels/IndexViewModel', 'knockout', 'domReady'], function(jquery, vm, ko)
{
	var index = new vm.ViewModel();
	/* #DEBUG */ if(typeof debug != typeof undefined) { window['viewModel'] = index; }
	ko.applyBindings(index);
});