require(['JeopardyViewModel', 'knockout', 'domReady'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	jeopardy.StartGame();
	ko.applyBindings(jeopardy);
});