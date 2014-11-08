import ko from 'knockout';
import mapping from 'knockout.mapping';
import errorhandler from 'errorhandler';
import * as dataaccess from 'dataaccess';
import { Category, Question } from 'jeopardyModels';
import bootstrap from 'bootstrap.min';

var error = new errorhandler();

export default class ManageViewModel {
	constructor ({ userid = '0' }) {
		if(!(this instanceof ManageViewModel))
			return new ManageViewModel();

		this.__userid = userid;
		this.__nameRegex = /^[a-zA-Z]( ?[\w]+){3,}$/;
		this.__textRegex = /^.+$/;
		this.__numberRegex = /\d+/;

		this.Categories = ko.observableArray([]);
		this.SelectedCategory = ko.observable();
		this.SelectedQuestion = ko.observable();

		this.NewCategory = ko.observable(mapping.fromJS(new Category({ name: '' })));
		this.NewQuestion = ko.observable(mapping.fromJS(new Question({ value: '', question: '', answer: '' })));

		this.CategoryEditting = ko.observable(false);
		this.QuestionEditting = ko.observable(false);
		
		dataaccess.GetCategories({ userid: userid })
		.then(data => {
			if(data.error)
				return error.Show({ message: data.message, title: 'Could not load categories' });

			if(Array.isArray(data)) {
				data.map(i => mapping.fromJS(i))
					.forEach(i => this.Categories.push(i));
			}
			else
			{
				console.log("Server returned weird data: %s", JSON.stringify(data));
				error.Show({ message: 'The data returned from the server was not valid', title: 'Could not load categories'});
			}
		},
		error => {
			console.log(error);
			error.Show({ message: error, title: 'Could not load categories'});
		});
	}

	SelectCategory (category) {
		this.SelectedCategory(category);
		this.ClearEditCategory(category);
	}

	SelectQuestion (question) {
		this.SelectedQuestion(question);
		this.ClearEditQuestion(question);
	}

	AddCategory () {
		var name = this.NewCategory().Name();
		var editting = this.CategoryEditting();

		if(!this.__nameRegex.test(name)) {
			error.Show({ title: 'Invalid Category Name', message: 'Please include a valid name for your category.' });
		}
		else {
			var onError = err => {
				error.Show({ title: 'Error Saving Category', message: 'An error occurred while saving the new category. ' + err.message });
			};
			var onSuccess = res => {
				if(res.error) {
					error.Show({ title: 'Error Saving Category', message: res.message });
				}
				else {
					if(!editting)
						this.Categories.push(mapping.fromJS(res));
					else
						this.CategoryEditting(false);

					this.NewCategory(mapping.fromJS(new Category({ name: '' })));
				}
			};

			if(editting) {
				dataaccess.UpdateCategory({ userid: this.__userid, categoryid: this.NewCategory()._id(), name: name })
				.then(onSuccess, onError);
			}
			else {
				dataaccess.NewCategory({ userid: this.__userid, name: name })
				.then(onSuccess, onError);				
			}

		}
	}

	EditCategory(category) {
		this.CategoryEditting(true);
		this.SelectedCategory(category);
		this.NewCategory(this.SelectedCategory());
	}

	ClearEditCategory(category) {
		this.CategoryEditting(false);
		this.NewCategory(mapping.fromJS(new Category({ name: '' })));
	}

	DeleteCategory(category, element) {
		error.Confirm({ title: 'Confirm Deleting Category' })
		.then(() => {
			// On resolve
			if(this.SelectedCategory() == category) {
				this.SelectedCategory(undefined);
			}

			dataaccess.DeleteCategory({ userid: this.__userid, categoryid: category._id() })
			.then(res => {
				if(res.error) {
					console.log(res);
					error.Show({ message: res.message, title: 'Could not delete category' });
				}
				else {
					this.Categories.remove(category);
					error.Show({ title: 'Category successfully deleted.', level: 'success' });
				}
			},
			err => {
				error.Show({ message: err.message, title: 'Could not delete category' });
			});
		},
		() => {
			// On reject
			// Do nothing. They canceled the delete.
		});
	}

	AddQuestion () {
		var value = this.NewQuestion().Value(),
			question = this.NewQuestion().Question(),
			answer = this.NewQuestion().Answer(),
			questionValid,
			answerValid,
			valueValid,
			category = this.SelectedCategory(),
			editting = this.QuestionEditting();

		if(!(questionValid = this.__textRegex.test(question))) {
			error.Show({ title: 'Invalid Question Text', message: 'The new question you have provided is invalid.'});
		}
		if(!(answerValid = this.__textRegex.test(answer))) {
			error.Show({ title: 'Invalid Answer Text', message: 'The new answer you have provided is invalid.'});
		}
		if(!(valueValid = this.__numberRegex.test(value))) {
			error.Show({ title: 'Inavlid Value', message: 'The new value you have provided is invalid.'});
		}

		if(questionValid && answerValid && valueValid) {
			var onSuccess = (res) => {
				if(res.error)
					error.Show({ title: 'Could not create question', message: res.message });
				else {
					if(editting) {
						this.QuestionEditting(false);
					}
					else {
						category.Questions.push(mapping.fromJS(res));
					}

					this.NewQuestion(mapping.fromJS(new Question({ value: '', question: '', answer: '' })));
				}
			};

			var onError = err => {
				error.Show({ title: 'Could not create question', message: err.message });
			};

			var data = {
				userid: this.__userid,
				categoryid: category._id(),
				value: value,
				answer: answer,
				question: question
			};

			if(editting) {
				data.questionid = this.SelectedQuestion()._id();

				dataaccess.UpdateQuestion(data)
				.then(onSuccess, onError);
			}
			else {
				dataaccess.NewQuestion(data)
				.then(onSuccess, onError);
			}
		}
	}

	EditQuestion(question) {
		this.QuestionEditting(true);
		this.SelectedQuestion(question);
		this.NewQuestion(this.SelectedQuestion());
	}

	ClearEditQuestion(question) {
		this.QuestionEditting(false);
		this.NewQuestion(mapping.fromJS(new Category({ name: '' })));
	}

	DeleteQuestion(question) {
		error.Confirm({ title: 'Confirm Deleting Question' })
		.then(() => {
			var questionid = question._id(),
			category = this.SelectedCategory(),
			userid = this.__userid;

			dataaccess.DeleteQuestion({ userid: userid, questionid: questionid, categoryid: category._id() })
			.then(res => {
				if(res.error)
					error.Show({ title: 'Error deleting question', message: res.message });
				else {
					category.Questions.remove(question);
					error.Show({ title: 'Question successfully deleted.', level: 'success' });
				}
			},
			err => {
				error.Show({ title: 'Error deleting question', message: err.message });
			});
		},
		() => { });
	}
}