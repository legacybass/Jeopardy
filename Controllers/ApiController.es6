import { Categories, Users, Questions, Games } from '../Modules/DataInteraction';

export default function Bootstrap (router) {
	// Login a user
	router.post('/api/Home/Login', (req, res, next) => {
		var username = req.body['username'] || req.params['username'];
		var password = req.body['password'] || req.params['password'];

		req.session.user = undefined;

		Users.GetUser({ username: username, password: password })
			.then(user => {
				req.session.user = user._id;
				res.json({ user: user._id });
			},
			err => {
				console.log(err.exception);
				res.json({ error: true, message: err.message });
			});
	});

	// Register a new user
	router.post('/api/Home', (req, res, next) => {
		var username = req.body['username'] || req.params['username'],
			password = req.body['password'] || req.params['password'];

		if(!(/^[a-zA-Z][\w ]{3,}$/.test(username)))
			return res.json({ error: true, message: 'Invalid username: ' + username });
		if(!(/^\w{4,}$/.test(password)))
			return res.json({ error: true, message: 'Invalid password' });

		Users.Register({ username: username, password: password })
		.then(user => {
			res.json({ data: 'User ' + user.Login + ' Successfully Registered'});
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});


	var LoggedInCheck = (req, res, next) => {
		var userId = req.params.userid || req.body.userid || req.query.userid;

		if(!req.session.user || req.session.user !== userId) {
			return res.json({ error: true, message: 'You are not logged in.', redirect: '/Home/Login' });
		}
		else
			next();
	};

	// Check that the user is logged in for category requests
	router.all('/api/Data/*', LoggedInCheck);



	// Load all associated categories	
	router.get('/api/Data/Categories', (req, res, next) => {
		var userId = req.query['userid'];

		Categories.GetCategories({ userId: userId })
		.then((categories) => {
			res.json(categories);
		},
		(err) => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});

	// Create a new category
	router.post('/api/Data/Categories', (req, res, next) => {
		var userId = req.body.userid,
			name = req.body.name;

		Categories.CreateCategory({ name: name, userId: userId })
		.then((category) => {
			res.json(category);
		},
		(err) => {
			console.log("Creating category FAILED!", err.exception)
			res.json({ error: true, message: err.message });
		});
	});

	// Update a category's information
	router.put('/api/Data/Categories/:categoryid', (req, res, next) => {
		var userId = req.body.userid,
			categoryId = req.params.categoryid,
			name = req.body.name;

		Categories.UpdateCategory({ userId: userId, categoryId: categoryId, name: name })
		.then(category => {
			res.json(category);
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});

	// Delete a category
	router.del('/api/Data/Categories/:categoryid', (req, res, next) => {
		var userId = req.body.userid,
			categoryId = req.params.categoryid;

		Categories.DeleteCategory({ userId: userId, categoryId: categoryId })
		.then(category => {
			res.json(category);
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});



	// Update a question's information
	router.put('/api/Data/Questions/:categoryid', (req, res, next) => {
		var userId = req.body.userid,
			questionId = req.body.questionid,
			categoryId = req.params.categoryid,
			value = req.body.value,
			question = req.body.question,
			answer = req.body.answer;

		Questions.UpdateQuestion({ userId: userId, categoryId: categoryId, questionId: questionId, value: value, question: question, answer: answer })
		.then(question => {
			res.json(question);
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});

	// Create a new question
	router.post('/api/Data/Questions/:categoryid', (req, res, next) => {
		var userId = req.body.userid,
			categoryId = req.params.categoryid,
			value = req.body.value,
			question = req.body.question,
			answer = req.body.answer;

		Questions.CreateQuestion({ userId: userId, categoryId: categoryId, value: value, answer: answer, question: question})
		.then(question => {
			res.json(question);
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});

	// Delete a given category
	router.del('/api/Data/Questions/:categoryid', (req, res, next) => {
		var userId = req.body.userid,
			questionId = req.body.questionid,
			categoryId = req.params.categoryid;

		Questions.DeleteQuestion({ userId: userId, questionId: questionId, categoryId: categoryId })
		.then(question => {
			res.json(question);
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});


	// Create a new game
	router.post('/api/Data/Game', (req, res, next) => {
		// Create a new game in the database with the required information
		var name = req.body.name,
			identifier = req.body.identifier;

		Games.CreateGame({ name: name, identifier: identifier })
		.then(game => {
			res.json({ game: game._id });
		},
		err => {
			console.log(err.exception);
			res.json({ error: true, message: err.message });
		});
	});

	// Get the stats for a game
	router.get('/api/Data/Game', (req, res, next) => {
		var gameId = req.body.gameId;

		Games.GetStats({ gameId })
		.then((stats) => {
			res.json(stats);
		},
		(err) => {
			console.log(err);
			res.json({ message: 'Could not get game stats.', error: true });
		});
	});
}