var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	bcrypt = require('bcrypt-nodejs'),
	SALT_WORK_FACTOR = 11;

var UserModel = new Schema({
	Login: { type: String, required: true },
	Password: { type: String, required: true },
	Categories: [{ type: ObjectId, ref: 'Category' }]
});

UserModel.pre('save', function (next) {
	var user = this;

	if(!user.isModified('Password'))
		return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if(err)
			return next(err);

		bcrypt.hash(user.Password, salt, function OnProgress(progress) { }, function OnFinish (err, hash) {
			if(err)
				return next(err);

			user.Password = hash;
			next();
		});
	});
});

UserModel.methods.ComparePassword = function(password, callback) {
	bcrypt.compare(password, this.Password, function (err, isMatch) {
		if(err)
			return callback(err);

		callback(null, isMatch);
	})
}

module.exports = UserModel;