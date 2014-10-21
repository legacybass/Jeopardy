export class Category {
	constructor ({ id = -1, name = 'New Category', questions = [ ] }) {
		this.Id = id;
		this.Name = name;
		this.Questions = questions;
	}

	AddQuestion (question) {
		this.Questions.push(question);
	}
}

export class Question {
	constructor ({ id = -1, value = 200, question = 'What is your favorite color', answer = 'Blu... no, yell OOooww!'}) {
		this.Id = id;
		this.Value = value;
		this.Question = question;
		this.Answer = answer;
	}
}
