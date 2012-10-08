require(['JeopardyViewModel', 'knockout', 'domReady'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	ko.applyBindings(jeopardy);
	jeopardy.StartGame();
});