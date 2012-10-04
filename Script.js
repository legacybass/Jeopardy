require(['JeopardyViewModel', 'knockout'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	ko.applyBindings(jeopardy);
});