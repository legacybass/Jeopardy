require(['ViewModels/DataManagementViewModel', 'knockout', 'domReady'], function(vm, ko)
{
	var viewmodel = new vm.DataManagementViewModel();
	/* #DEBUG# */ if(typeof debug != typeof undefined) window['DataManagementViewModel'] = viewmodel;
	ko.applyBindings(viewmodel);
});