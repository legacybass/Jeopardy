"use strict";
Object.defineProperties(exports, {
default:
    {
        get: function () {
            return $__default;
        }
    }, __esModule: {
        value: true
    }
});
var __moduleName = "ApiController.es6";
var $___46__46__47_Modules_47_DataInteraction__;
var $__0 = ($___46__46__47_Modules_47_DataInteraction__ = require("../Modules/DataInteraction"), $___46__46__47_Modules_47_DataInteraction__ && $___46__46__47_Modules_47_DataInteraction__.__esModule && $___46__46__47_Modules_47_DataInteraction__ || {
default:
    $___46__46__47_Modules_47_DataInteraction__
}),
    Categories = $__0.Categories,
    Users = $__0.Users,
    Questions = $__0.Questions;

function Bootstrap(router) {
    router.post('/api/Home/Login', (function (req, res, next) {
        var username = req.body['username'] || req.params['username'];
        var password = req.body['password'] || req.params['password'];
        if (req.session.user) {
            return res.json({
                user: req.session.user
            });
        }
        Users.GetUser({
            username: username,
            password: password
        }).then((function (user) {
            req.session.user = user._id;
            res.json({
                user: user._id
            });
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.post('/api/Home', (function (req, res, next) {
        var username = req.body['username'] || req.params['username'],
            password = req.body['password'] || req.params['password'];
        if (!(/^[a-zA-Z][\w ]{3,}$/.test(username))) return res.json({
            error: true,
            message: 'Invalid username: ' + username
        });
        if (!(/^\w{4,}$/.test(password))) return res.json({
            error: true,
            message: 'Invalid password'
        });
        Users.Register({
            username: username,
            password: password
        }).then((function (user) {
            res.json({
                data: 'User ' + user.Login + ' Successfully Registered'
            });
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    var LoggedInCheck = (function (req, res, next) {
        var userId = req.params.userid || req.body.userid || req.query.userid;
        if (!req.session.user || req.session.user !== userId) {
            return res.json({
                error: true,
                message: 'You are not logged in.',
                redirect: '/Home/Login'
            });
        } else next();
    });
    router.all('/api/Data/*', LoggedInCheck);
    router.get('/api/Data/Categories', (function (req, res, next) {
        var userId = req.query['userid'];
        Categories.GetCategories({
            userId: userId
        }).then((function (categories) {
            res.json(categories);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.post('/api/Data/Categories', (function (req, res, next) {
        var userId = req.body.userid,
            name = req.body.name;
        Categories.CreateCategory({
            name: name,
            userId: userId
        }).then((function (category) {
            res.json(category);
        }), (function (err) {
            console.log("Creating category FAILED!", err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.put('/api/Data/Categories/:categoryid', (function (req, res, next) {
        var userId = req.body.userid,
            categoryId = req.params.categoryid,
            name = req.body.name;
        Categories.UpdateCategory({
            userId: userId,
            categoryId: categoryId,
            name: name
        }).then((function (category) {
            res.json(category);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.del('/api/Data/Categories/:categoryid', (function (req, res, next) {
        var userId = req.body.userid,
            categoryId = req.params.categoryid;
        Categories.DeleteCategory({
            userId: userId,
            categoryId: categoryId
        }).then((function (category) {
            res.json(category);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.put('/api/Data/Questions/:categoryid', (function (req, res, next) {
        var userId = req.body.userid,
            questionId = req.body.questionid,
            categoryId = req.params.categoryid,
            value = req.body.value,
            question = req.body.question,
            answer = req.body.answer;
        Questions.UpdateQuestion({
            userId: userId,
            categoryId: categoryId,
            questionId: questionId,
            value: value,
            question: question,
            answer: answer
        }).then((function (question) {
            res.json(question);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.post('/api/Data/Questions/:categoryid', (function (req, res, next) {
        var userId = req.body.userid,
            categoryId = req.params.categoryid,
            value = req.body.value,
            question = req.body.question,
            answer = req.body.answer;
        Questions.CreateQuestion({
            userId: userId,
            categoryId: categoryId,
            value: value,
            answer: answer,
            question: question
        }).then((function (question) {
            res.json(question);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
    router.del('/api/Data/Questions/:categoryid', (function (req, res, next) {
        var userId = req.body.userid,
            questionId = req.body.questionid,
            categoryId = req.params.categoryid;
        Questions.DeleteQuestion({
            userId: userId,
            questionId: questionId,
            categoryId: categoryId
        }).then((function (question) {
            res.json(question);
        }), (function (err) {
            console.log(err.exception);
            res.json({
                error: true,
                message: err.message
            });
        }));
    }));
}
var $__default = Bootstrap;