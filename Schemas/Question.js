
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

function ValidateValue(val)
{
	var valType = typeof val;
	if(valType == "string")
	{
		val = parseInt(val);
		val = ValidateValue(val);
	}
	else if(valType == "number")
	{
		if(val % 100 != 0)
			val = 0;
		else
		{
			var validArr = [100, 200, 400, 800, 1000];
			var isValid = false;
			for (var i = validArr.length - 1; i >= 0; i--) {
				if(val == validArr[i])
					isValid = true;
			};
			if(!isValid)
				val = 0;
		}
	}
	else
		val = 0;

	return val;
}

var QuestionModel = new Schema({
	ID: { type: ObjectId, index: true },
	Question: { type: String, required: true, trim: true },
	Answer: { type: String, required: true, trim: true },
	Value: { type: Number, required: true, min: 100, max: 2000, set: ValidateValue },
	Category: { type: ObjectId, ref: 'Category' }
});

mongoose.model('Question', QuestionModel);
module.exports = QuestionModel;
