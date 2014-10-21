var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var QuestionSchema = new Schema({
	Value: { type: Number, required: true },
	Question: { type: String, required: true },
	Answer: { type: String, required: true }
});

module.exports = QuestionSchema;
