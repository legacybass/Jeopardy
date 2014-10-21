var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var GameSchema = new Schema({
	Name: { type: String, required: true },
	Players: [{
		Id: { type: String, required: true },
		Name: { type: String, required: true },
		Score: { type: Number, min: 0, default: 0 },
		BuzzCount: { type: Number, min: 0, default: 0 }
	}]
});

module.exports = GameSchema;
