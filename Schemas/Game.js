var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	PlayerSchema = require('./Player');

var GameSchema = new Schema({
	Host: { type: String },
	Name: { type: String, required: true },
	Players: [ PlayerSchema ]
});

module.exports = GameSchema;
