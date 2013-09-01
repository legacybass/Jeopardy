require(['ViewModels/AnswerViewModel', 'knockout', 'domReady'], function(avm, ko, purl)
{
	var answer = avm.ViewModel();
	ko.applyBindings(answer);
	window.viewModel = answer;
});