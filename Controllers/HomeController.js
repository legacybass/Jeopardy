var mongoose = require('mongoose'),
	Helpers = require('./ControllerHelpers');

function RenderPage(req, res, action, data)
{
	Helpers.RenderPage(req, res, 'Home', action, data);
}

exports.Index = function(req, res)
{
	RenderPage(req, res, 'Index', { });
}

exports.Answer = function(req, res)
{
	RenderPage(req, res, 'AnswerWindow', { });
}

exports.Contestant = function(req, res)
{
	RenderPage(req, res, 'Contestant', { });
}

exports.DataManagement = function(req, res)
{
	RenderPage(req, res, 'DataManagement', { });
}

exports.Jeopardy = function(req, res)
{
	RenderPage(req, res, 'Jeopardy', { });
}