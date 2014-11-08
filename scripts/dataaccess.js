import p from 'libs/porter';
import Promise from 'libs/promise';
import ErrorHandler from 'errorhandler';

var errorHandler = new ErrorHandler();

var porter = p({
	categories: {
		list: ['get', '/api/Data/Categories'],
		update: ['put', '/api/Data/Categories/:categoryid'],
		new: ['post', '/api/Data/Categories'],
		delete: ['delete', '/api/Data/Categories/:categoryid']
	},
	questions: {
		update: ['put', '/api/Data/Questions/:categoryid'],
		new: ['post', '/api/Data/Questions/:categoryid'],
		delete: ['delete', '/api/Data/Questions/:categoryid']
	},
	users: {
		list: ['get', '/api/Home'],
		update: ['put', '/api/Home/:userid'],
		login: ['post', '/api/Home/Login'],
		new: ['post', '/api/Home']
	},
	contestant: {
		login: ['post', '/api/Contestant/Login']
	},
	game: {
		new: ['post', '/api/Data/Game'],
		stats: ['get', '/api/Data/Game']
	}
}).on({
	'500': (err, response) => {
		errorHandler.Show({ title: 'Internal server error', message: err || response });
	},
	'404': (err, response) => {
		errorHandler.Show({ title: 'Page not found', message: err || response });
	}
});

export function UserLogin (username, password) {
	return new Promise((resolve, reject) => {
		porter.users.login({ username: username, password: password }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function UserRegister(username, password) {
	return new Promise((resolve, reject) => {
		porter.users.new({ username: username, password: password }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}



export function GetCategories({ required = [], userid = '-1' }) {
	return new Promise((resolve, reject) => {
		porter.categories.list({ required: required, userid: userid },	(err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function DeleteCategory({ userid = '0', categoryid = '0' }) {
	return new Promise((resolve, reject) => {
		porter.categories.delete({ categoryid: categoryid }, { userid: userid }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function UpdateCategory({ userid = '0', categoryid = '0', name }) {
	return new Promise((resolve, reject) => {
		porter.categories.update({ categoryid: categoryid }, { userid: userid, name: name }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function NewCategory({ userid = '0', name }) {
	return new Promise((resolve, reject) => {
		porter.categories.new({ userid: userid, name: name }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}



export function UpdateQuestion({ userid = '0', questionid = '0', categoryid = '0', value, question, answer }) {
	return new Promise((resolve, reject) => {
		porter.questions.update({ categoryid: categoryid },
			{ userid: userid, questionid: questionid, value: value, question: question, answer: answer },
			(err, res) => {
				if(err)
					reject(err);
				else
					resolve(res);
			});
	});
}

export function DeleteQuestion({ userid = '0', questionid = '0', categoryid = '0' }) {
	return new Promise((resolve, reject) => {
		porter.questions.delete({ categoryid: categoryid },
			{ userid: userid, questionid: questionid },
			(err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function NewQuestion({ userid = '0', categoryid = '0', value, question, answer }) {
	return new Promise((resolve, reject) => {
		porter.questions.new({ categoryid: categoryid }, { value: value, question: question, answer: answer, userid: userid },
		(err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}



export function ContestantLogin({ }) {
	return new Promise((resolve, reject) => {
		reject({ message: 'Not implemented' });
	});
}



export function CreateGame({ userid, name, identifier }) {
	return new Promise((resolve, reject) => {
		porter.game.new({ name: name, identifier: identifier, userid: userid }, (err, res) => {
			if(err)
				reject(err);
			else
				resolve(res);
		});
	});
}

export function GetGameStats({ game, identifier }) {
	return new Promise((resolve, reject) => {
		reject({ message: 'Not implemented' });
	});
}
