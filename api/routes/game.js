const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helpers = require('./helpers');

const router = express.Router();
const Category = mongoose.model('category');

const transformCategory = helpers.TransformCategory;

router.options('/', cors());

router.all('/', (req, res, next) => {
	// preparing for authentication
	next();
});

router.post('/create', (req, res, next) => {
	const {
		includedCategories,
		gameCode
	} = req.body;

	const promises = [];

	const requestCategories = JSON.parse(includedCategories);
	if(Array.isArray(requestCategories) && requestCategories.length > 0) {
		const categoryPromise = Category.find({})
		.where('_id')
		.in(requestCategories.map(ic => new mongoose.Types.ObjectId(ic)));
		promises.push(categoryPromise);
	}
	else {
		promises.push(Promise.resolve([]));
	}

	Promise.all(promises)
	.then(([categories]) => {
		if(categories.length < 5) {
			// need to have 5 categories, so make sure we do
			const ids = categories.map(c => c._id);

			return Category.find({})
			.where('_id')
			.nin(ids)
			.then(newCategories => {
				let needed = 5 - categories.length;
				while(needed-- > 0) {
					const index = Math.trunc(Math.random() * newCategories.length);
					categories.push(newCategories[index]);
					newCategories.splice(index, 1);
				}

				return [categories];
			});
		}
		else {
			return [categories];
		}
	})
	.then(([categories]) => {
		const gameAnswers = categories.map(c => {
			if(c === null || c === undefined)
				return c;
			
			const questions = c.questions;
			if(questions.length > 5) {
				const selected = [];
				
				while(selected.length < 5) {
					const index = Math.trunc(Math.random() * questions.length);
					selected.push(questions[index]);
					questions.splice(index, 1);
				}

				c.questions = selected;
			}

			return c;
		});

		res.json(categories);
	})
	.catch(next);
});

module.exports = router;