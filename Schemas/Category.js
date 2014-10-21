var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	questionSchema = require('./Question');

var CategorySchema = new Schema({
	Name: { type: String, required: true },
	Questions: [questionSchema],
	User: { type: ObjectId, ref: 'User' }
});

module.exports = CategorySchema;
