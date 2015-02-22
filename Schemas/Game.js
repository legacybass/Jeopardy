var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	PlayerSchema = require('./Player'),
	CategorySchema = require('./Category');

var GameSchema = new Schema({
	Host: { type: String },
	Name: { type: String, required: true },
	Categories: [CategorySchema],
	Players: [ PlayerSchema ]
});

module.exports = GameSchema;
