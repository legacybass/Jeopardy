const mongoose = require('mongoose');

const game = new mongoose.Schema({
	created: { type: Date },
	players: [{
		username: { type: String, required: true, maxlength: 50, minlength: 1 },
		playerid: { type: Number, required: true, min: 1 },
		points: { type: Number }
	}]
});