require(['ViewModels/JeopardyViewModel', 'knockout', 'domReady'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	/* #DEBUG */ if(typeof debug != typeof undefined) window.jeopardy = jeopardy;
	jeopardy.StartGame();
	ko.applyBindings(jeopardy);
});