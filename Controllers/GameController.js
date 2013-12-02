var mongoose = require('mongoose')
	//, socketio = require('socket.io')
	, Helpers = require('./ControllerHelpers');

// Helper functions
function GetQuestions(categoryID, callback)
{
	var QuestionModel = mongoose.model('Question');
	QuestionModel.find({ Category: { ID: categoryID } })
		.select('Question Answer Value')
		.populate('Category', 'Name')
		.exec(function (err, questions)
		{
			var rtObj = {};
			if(err)
			{
				rtObj.Error = err;
			}
			else
			{
				rtObj.Questions = questions;
			}

			callback(rtObj);
		});
}

function GetCategories(requiredCategories, callback)
{
	var CategoryModel = mongoose.model('Category');
	var query = CategoryModel.find({});

	if(requiredCategories && Array.isArray(requiredCategories) && requiredCategories.length > 0)
		query = query.where('Name').in(requiredCategories);

	query.populate('Questions', 'Question Answer Value')
		.select('Name Questions')
		.exec(function (err, categories)
		{
			var rtObj = {};
			if(err)
			{
				rtObj.Error = err;
			}
			else
			{
				rtObj.Categories = categories;
			}

			callback(rtObj);
		});
}


// MVC Visible functions
exports.Questions = function (req, res)
{
	var categoryID = req.params['categoryID'];
	QuestionsHelper(req, res, categoryID);
}
exports.QuestionsPost = function(req, res)
{
	var categoryID = req.query['categoryID'];
	QuestionsHelper(req, res, categoryID);
}
function QuestionsHelper(req, res, categoryID)
{
	GetQuestions(categoryID, function (rtObj)
	{
		res.json(rtObj);
	});
}


exports.Categories = function (req, res)
{
	var required = req.params['requiredCategories'];
	CategoriesHelper(req, res, required);
}
exports.CategoriesPost = function(req, res)
{
	var required = req.query['requiredCategories'];
	CategoriesHelper(req, res, required);
}
function CategoriesHelper(req, res, required)
{
	GetCategories(required, function (rtObj)
	{
		res.json(rtObj);
	});
}


exports.FinalQuestion = function (req, res)
{
	var required = req.params['requiredCategory'];
	FinalQuestionHelper(req, res, required);
}
exports.FinalQuestionPost = function(req, res)
{
	var required = req.query['requiredCategory'];
	FinalQuestionHelper(req, res, required);
}
function FinalQuestionHelper(req, res, required)
{

	GetCategories([required], function (rtObj)
	{
		if(rtObj.Error)
		{
			res.json(rtObj);
		}
		else
		{
			var index = Math.floor(Math.random() * rtObj.Categories.length);
			var category = rtObj.Categories[index];
			GetQuestions(category.ID, function (rtObj)
			{
				if(rtObj.Error)
				{
					res.json(rtObj);
				}
				else
				{
					index = Math.floor(Math.random() * rtObj.Questions.length);
					var question = rtObj.Questions[index];
					res.json({ CategoryName: category.Name, Question: question });
				}
			});
		}
	});
}