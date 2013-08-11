exports.RenderPage = function(req, res, controller, action, data, requireData)
{
	console.log("Sending file: " + controller + '/' + action);
	data.ViewModel = '/public/javascript/Controllers/' + controller + '/' + action + 'ViewModel';
	data.PageData = requireData || {};
	res.render(controller + '/' + action, data);
}
