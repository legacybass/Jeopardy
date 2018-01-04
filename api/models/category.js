const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: { type: String, maxlength: 100, minlength: 1, trim: true, required: true },
	questions: [{
		question: { type: String, maxlength: 500, minlength: 1, trim: true, required: true },
		answer: { type: String, maxlength: 300, minlength: 1, trim: true, required: true },
		value: { type: Number, min: 0, required: true }
	}]
});

mongoose.model('category', categorySchema);

module.exports = categorySchema;
