const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helpers = require('./helpers');
const router = express.Router();
const Category = mongoose.model('category');

const transformCategory = helpers.TransformCategory;

router.options('/', cors());

// Ensure the user is authenticated
router.all('/', (req, res, next) => {
	// since authentication isn't a thing yet, just call next
	next();
});

// Get all categories
router.get('/categories', (req, res, next) => {
	Promise.resolve()
	.then(() => Category.find({}))
	.then(categories => {
		if(!categories)
			throw new Error(`Could not find any categories`);
		return categories
	})
	.then(categories => categories.map(transformCategory))
	.then(categories => res.json(categories))
	.catch(next);
});

// Create a new category
router.post('/category', (req, res, next) => {
	const name = req.body.name;
	if(typeof name !== 'string')
		return next(new Error('Invalid type for parameter "name"'));
	
	const category = new Category({ name, questions: [] });
	Promise.resolve()
	.then(() => category.save())
	.then(transformCategory)
	.then(c => res.json(c))
	.catch(next);
});

// Update an existing category
router.put('/category/:id', (req, res, next) => {
	const categoryId = req.params.id;
	const name = req.body.name;

	if(typeof name !== 'string')
		return next(new Error('Invalid type for parameter "name"'));

	Promise.resolve()
	.then(() => Category.findOne({ _id: categoryId }))
	.then(category => {
		if (!category)
			throw new Error(`Could not find category with id ${categoryId}`);
		return category;
	})
	.then(category => {
		category.name = name;
		return category.save();
	})
	.then(transformCategory)
	.then(category => res.json(category))
	.catch(next);
});

// Delete an existing category and all associated questions
router.delete('/category/:id', (req, res, next) => {
	const categoryId = req.params.id;

	Promise.resolve()
	.then(() => Category.remove({ _id: categoryId }))
	.then(() => res.json({ id: categoryId }))
	.catch(next);
});

// Get all questions for a category
router.get('/questions/:categoryid', (req, res, next) => {
	const id = req.params.categoryid;

	Promise.resolve()
	.then(() => Category.findOne({ _id: id }))
	.then(category => {
		if (!category)
			throw new Error(`Could not find category with id ${id}`);
		return category;
	})
	.then(category => {
		category = transformCategory(category);
		res.json(category.questions);
	})
	.catch(next);
});

// Create a new question in a category
router.post('/question/:categoryid', (req, res, next) => {
	const id = req.params.categoryid;
	const question = req.body.question,
		answer = req.body.answer,
		value = parseInt(req.body.value, 10);

	if(typeof question !== 'string')
		return next(new Error('Invalid type for parameter "question"'));
	if(typeof answer !== 'string')
		return next(new Error('Invalid type for parameter "answer"'));
	if(isNaN(value))
		return next(new Error('Invalid type for parameter "value"'));

	Promise.resolve()
	.then(() => Category.findOne({ _id: id }))
	.then(category => {
		if (!category)
			throw new Error(`Could not find category with id ${id}`);
		return category;
	})
	.then(category => {
		category.questions.push({ question, answer, value });
		return category.save();
	})
	.then(transformCategory)
	.then(category => res.json(category))
	.catch(next);
});

// Update an existing question in a category
router.put('/question/:categoryid/:questionid', (req, res, next) => {
	const categoryId = req.params.categoryid,
		questionIndex = req.params.questionid;

	const question = req.body.question,
		answer = req.body.answer,
		value = parseInt(req.body.value, 10);

	if (typeof question !== 'string')
		return next(new Error('Invalid type for parameter "question"'));
	if (typeof answer !== 'string')
		return next(new Error('Invalid type for parameter "answer"'));
	if (isNaN(value))
		return next(new Error('Invalid type for parameter "value"'));

	Promise.resolve()
	.then(() => Category.findOne({ _id: categoryId }))
	.then(category => {
		if (!category)
			throw new Error(`Could not find category with id ${categoryId}`);
		return category;
	})
	.then(category => {
		const q = category.questions[questionIndex];
		if(!question)
			throw new Error(`No question could be found for category ${categoryId} with id ${questionIndex}`);
		
		Object.assign(q, { question, answer, value });
		category.questions[questionIndex] = q;
		return category.save();
	})
	.then(transformCategory)
	.then(category => res.json(category))
	.catch(next);
});

// Delete a question from a category
router.delete('/question/:categoryid/:questionid', (req, res, next) => {
	const categoryId = req.params.categoryid,
		questionIndex = req.params.questionid;

	Promise.resolve()
	.then(() => Category.findOne({ _id: categoryId }))
	.then(category => {
		if (!category)
			throw new Error(`Could not find category with id ${categoryId}`);
		return category;
	})
	.then(category => {
		const question = category.questions[questionIndex];
		if(!question)
			throw new Error(`No question could be found for category ${categoryId} with id ${questionIndex}`);
		
		category.questions.splice(questionIndex, 1);
		return category.save();
	})
	.then(transformCategory)
	.then(category => res.json(category))
	.catch(next);
});

module.exports = router;