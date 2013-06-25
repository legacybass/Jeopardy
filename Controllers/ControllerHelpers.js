exports.RenderPage = function(req, res, controller, action, data)
{
	// data.ViewModel = "/public/javascript/Controllers/" + controller + "/" + action + "ViewModel";
	res.render(controller + '/' + action, data);
}