var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectID = Schema.ObjectId;

var GameSchema = new Schema({
	ID: ObjectID
	, Name: { type: String, required: true }
});

mongoose.model('Game', GameSchema);
module.exports = GameSchema;