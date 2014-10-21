document.getElementById('nojavascript').style.display = 'none';

require(['router'], function(router)
{
	router.SetupRoutes('#main');
	router.Start();
});
