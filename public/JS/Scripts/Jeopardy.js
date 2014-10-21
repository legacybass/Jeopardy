require(['ViewModels/JeopardyViewModelNew', 'knockout', 'libs/purl', 'domReady'], function(jvm, ko, purl)
{
	var url = purl();

	var categoriesArr = url.param('categories')
		, onlineUrlArr = url.param('onlineUrl')
		, timerArr = url.param('timer')
		, onlineGameArr = url.param('onlineGame')
		, gameNameArr = url.param('gameName');

	var categories = Array.isArray(categoriesArr) ? categoriesArr[1] : undefined
		, onlineUrl = Array.isArray(onlineUrlArr) ? onlineUrlArr[1] : undefined
		, timer = Array.isArray(timerArr) ? timerArr[1] : undefined
		, onlineGame = Array.isArray(onlineGameArr) ? onlineGameArr[1] : undefined
		, gameName = Array.isArray(gameNameArr) ? gameNameArr[1] : (new Date()).toLocaleString();

	var jeopardy = new jvm.ViewModel({
		Categories: categories
		, OnlineUrl: onlineUrl
		, TimerDuration: timer
		, IsOnlineGame: onlineGame === 'on'
		, Name: gameName
		, Chart: 'chart'
		, Table: 'chartData'
	});

	/* #DEBUG */ if(typeof debug != typeof undefined) window['viewmodel'] = jeopardy;
	
	jeopardy.StartGame();
	ko.applyBindings(jeopardy);
});