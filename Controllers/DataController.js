
function()
{
	var mongoose = require('mongoose'),
		Helpers = require('./ControllerHelpers');

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

		if(required && Array.isArray(required) && required.length > 0)
			query = query.where('Name').in(required);

		query.exec(function (err, categories)
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
		GetQuestions(categoryID, function (rtObj)
		{
			res.json(rtObj);
		});
	}
	exports.QuestionsPost = exports.Questions;


	exports.Categories = function (req, res)
	{
		var required = req.params['requiredCategories'];
		GetCategories(required, function (rtObj)
		{
			res.json(rtObj);
		});
	}
	exports.CategoriesPost = exports.Categories;


	exports.FinalQuestion = function (req, res)
	{
		var required = req.params['requiredCategory'];
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
	exports.FinalQuestionPost = exports.FinalQuestion;


	exports.CreateQuestion = function(req, res)
	{
		var questionData = req.params['Question'],
			QuestionModel = mongoose.model('Question');

		var question = new QuestionModel(questionData);
		question.save(function (err, newQuestion)
		{
			var rtObj = {};
			if(err)
			{
				rtObj.Error = err;
			}
			else
			{
				rtObj.Record = newQuestion;
			}

			res.json(rtObj);
		});
	}
	exports.CreateQuestionPost = exports.CreateQuestion;


	exports.CreateCategory = function(req, res)
	{
		var categoryData = req.params['Category'],
			CategoryModel = mongoose.model('Category');

		var category = new CategoryModel(categoryData);
		category.save(function (err, newCategory)
		{
			var rtObj = {};
			if(err)
				rtObj.Error = err;
			else
				rtObj.Record = newCategory;

			res.json(rtObj);
		});
	}
	exports.CreateCategoryPost = exports.CreateCategory;


	exports.GetTables = function(req, res)
	{

	}
	exports.GetTablesPost = exports.GetTables;

	exports.InsertRow = function(req, res)
	{

	}
	exports.InsertRowPost = exports.InsertRow;

	exports.UpdateRow = function(req, res)
	{

	}
	exports.UpdateRowPost = exports.UpdateRow;

	exports.AddRow = function(req, res)
	{

	}
	exports.AddRowPost = exports.AddRow;

	exports.DeleteRow = function(req, res)
	{

	}
	exports.DeleteRowPost = exports.DeleteRow;

	exports.ExportDB = function(req, res)
	{

	}
	exports.ExportDBPost = exports.ExportDB;

	exports.ImportDB = function(req, res)
	{

	}
	exports.ImportDBPost = exports.ImportDB;

})();