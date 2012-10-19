require(['JeopardyViewModel', 'knockout', 'domReady'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	window.jeopardy = jeopardy; // #DEBUG
	jeopardy.StartGame();
	ko.applyBindings(jeopardy);
});