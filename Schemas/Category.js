
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var CategoryModel = new Schema({
	ID: ObjectId,
	Name: { type: String, required: true },
	Questions: [{ type: ObjectId, ref: 'Question' }]
});

mongoose.model('Category', CategoryModel);
module.exports = CategoryModel;
