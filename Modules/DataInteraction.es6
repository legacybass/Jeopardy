import mongoose from 'mongoose';
import promise from '../public/js/libs/promise';

var ObjectId = mongoose.Schema.ObjectId;

export var Categories = (() => {
	var categoryModel = mongoose.model('Category'),
		userModel = mongoose.model('User');

	return {
		GetCategories: function ({ userId: user }) {
			return new Promise((resolve, reject) => {
				var query = categoryModel.find({ 'User': user });
				query.sort('Value');

				query.exec((err, results) => {
					if(err)
						reject({ message: err.message, exception: err });
					else
					{
						resolve(results);
					}
				});
			});
		},
		CreateCategory: ({ name, userId }) => {
			return new Promise((resolve, reject) => {
				userModel.findOne({ _id: userId })
				.exec((err, user) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });

					if(!user)
						return reject({ message: 'Could not find user' });


					var category = new categoryModel({
						Name: name,
						User: user
					});

					category.save(err => {
						if(err)
							return reject({ message: err.message, exception: err });

						user.Categories.push(category);
						user.save(err => {
							if(err)
								return reject({ message: err.message, exception: err });

							resolve(category);
						});
					});
				});
			});
		},
		UpdateCategory: ({ userId, categoryId, name }) => {
			return new Promise((resolve, reject) => {
				categoryModel.findOneAndUpdate({ 'User': userId, '_id': categoryId }, { Name: name })
				.exec((err, category) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });
					else
						resolve(category);
				});
			});
		},
		DeleteCategory: ({ userId, categoryId }) => {
			return new Promise((resolve, reject) => {
				categoryModel.findOneAndRemove({ 'User': userId, '_id': categoryId })
				.exec((err, category) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });
					if(!category)
						return reject({ message: 'Could not find category '});

					userModel.update({ _id: userId }, { '$pull': { Categories: category._id } },
					(err, count) => {
						if(err)
							return reject({ message: err.message, exception: err });

						resolve(category);
					});
				});
			});
		}
	};
})();


export var Users = (() => {
	var userModel = mongoose.model('User');

	return {
		GetUser: ({ username, password }) => {
			return new Promise((resolve, reject) => {
				userModel.findOne({ Login: username })
					.exec((err, user) => {
						if(err)
							return reject({ message: 'Invalid information', exception: err });
						if(!user)
							return reject({ message: 'Could not find user' });

						user.ComparePassword(password, (err, isMatch) => {
							if(err)
								return reject({ message: err.message, exception: err });
							if(!isMatch)
								return reject({ message: 'Password did not match' });

							resolve(user);
						});
					});
			});
		},
		Register: ({ username, password }) => {
			return new Promise((resolve, reject) => {
				userModel.find({ Login: username })
					.exec((err, users) => {
						if(users && users.length > 1)
							return reject({ message: 'A user with that username already exists.'});

						var newbie = new userModel({ Login: username, Password: password });
						newbie.save(err => {
							if(err)
								return reject({ message: err.message, exception: err });

							resolve(newbie);
						});
					});
			});
		}
	}
})();


export var Questions = (() => {
	var categoryModel = mongoose.model('Category'),
		questionModel = mongoose.model('Question');

	return {
		CreateQuestion: ({ userId, categoryId, value, answer, question }) => {
			return new Promise((resolve, reject) => {
				categoryModel.findOne({ _id: categoryId, User: userId })
				.exec((err, category) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });

					if(!category)
						return reject({ message: 'Could not find category' });

					var questionObj = category.Questions.create({ Value: value, Answer: answer, Question: question });
					category.Questions.push(questionObj);

					category.save(err => {
						if(err)
							reject({ message: err.message, exception: err });
						else
							resolve(questionObj);
					});
				});
			});
		},
		UpdateQuestion: ({ userId, questionId, categoryId, value, answer, question }) => {
			return new Promise((resolve, reject) => {
				categoryModel.findOne({ User: userId, _id: categoryId })
				.exec((err, category) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });
					if(!category)
						return reject({ message: 'Could not find category' });

					var questionObj = category.Questions.id(questionId);
					if(!questionObj)
						return reject({ message: 'Could not find question' });

					questionObj.Value = value;
					questionObj.Answer = answer;
					questionObj.Question = question;

					category.save(err => {
						if(err)
							return reject({ message: err.message, exception: err });

						resolve(questionObj);
					});
				});
			});
		},
		DeleteQuestion: ({ userId, questionId, categoryId }) => {
			return new Promise((resolve, reject) => {
				categoryModel.findOne({ User: userId, _id: categoryId })
				.exec((err, category) => {
					if(err)
						return reject({ message: 'Invalid information', exception: err });
					if(!category)
						return reject({ message: 'Could not find category' });

					var question = category.Questions.id(questionId).remove();
					if(!question)
						return reject({ message: 'Could not find question' });

					category.save(err => {
						if(err)
							return reject({ message: err.message, exception: err });

						resolve(question);
					});
				});
			});
		}
	};
})();
