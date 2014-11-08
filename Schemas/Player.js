var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var PlayerSchema = new Schema({
	Id: { type: String, required: true },
	Name: { type: String, required: true },
	Score: { type: Number, min: 0, default: 0 },
	BuzzCount: { type: Number, min: 0, default: 0 }
});

module.exports = PlayerSchema;
