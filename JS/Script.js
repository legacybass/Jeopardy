require(['JeopardyViewModel', 'knockout', 'domready!'], function(jvm, ko)
{
	var jeopardy = new jvm.JeopardyViewModel();
	ko.applyBindings(jeopardy);
});