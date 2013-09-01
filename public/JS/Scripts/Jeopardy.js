require(['ViewModels/JeopardyViewModelNew', 'knockout', 'libs/purl', 'domReady'], function(jvm, ko, purl)
{
	var url = purl();

	var jeopardy = new jvm.ViewModel({
		Categories: url.param('categories')[1],
		OnlineUrl: url.param('onlineUrl')[1],
		TimerDuration: url.param('timer')[1]
	});
	/* #DEBUG */ if(typeof debug != typeof undefined) window['viewmodel'] = jeopardy;
	jeopardy.StartGame();
	ko.applyBindings(jeopardy);
});