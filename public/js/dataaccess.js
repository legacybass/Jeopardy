define(['libs/porter', 'libs/promise', 'errorhandler'], function ($__0, $__2, $__4) {
    "use strict";
    if (!$__0 || !$__0.__esModule) $__0 = {
    default:
        $__0
    };
    if (!$__2 || !$__2.__esModule) $__2 = {
    default:
        $__2
    };
    if (!$__4 || !$__4.__esModule) $__4 = {
    default:
        $__4
    };
    var p = $__0.
default;
    var Promise = $__2.
default;
    var ErrorHandler = $__4.
default;
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
        }
    }).on({
        '500': (function (err, response) {
            errorHandler.Show({
                title: 'Internal server error',
                message: err || response
            });
        }),
        '404': (function (err, response) {
            errorHandler.Show({
                title: 'Page not found',
                message: err || response
            });
        })
    });

    function UserLogin(username, password) {
        return new Promise((function (resolve, reject) {
            porter.users.login({
                username: username,
                password: password
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function UserRegister(username, password) {
        return new Promise((function (resolve, reject) {
            porter.users.new({
                username: username,
                password: password
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function GetCategories($__6) {
        var $__8, $__9;
        var $__7 = $__6,
            required = ($__8 = $__7.required) === void 0 ? [] : $__8,
            userid = ($__9 = $__7.userid) === void 0 ? '-1' : $__9;
        return new Promise((function (resolve, reject) {
            porter.categories.list({
                required: required,
                userid: userid
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function DeleteCategory($__6) {
        var $__9, $__7;
        var $__8 = $__6,
            userid = ($__9 = $__8.userid) === void 0 ? '0' : $__9,
            categoryid = ($__7 = $__8.categoryid) === void 0 ? '0' : $__7;
        return new Promise((function (resolve, reject) {
            porter.categories.delete({
                categoryid: categoryid
            }, {
                userid: userid
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function UpdateCategory($__6) {
        var $__7, $__8;
        var $__9 = $__6,
            userid = ($__7 = $__9.userid) === void 0 ? '0' : $__7,
            categoryid = ($__8 = $__9.categoryid) === void 0 ? '0' : $__8,
            name = $__9.name;
        return new Promise((function (resolve, reject) {
            porter.categories.update({
                categoryid: categoryid
            }, {
                userid: userid,
                name: name
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function NewCategory($__6) {
        var $__8;
        var $__7 = $__6,
            userid = ($__8 = $__7.userid) === void 0 ? '0' : $__8,
            name = $__7.name;
        return new Promise((function (resolve, reject) {
            porter.categories.new({
                userid: userid,
                name: name
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function UpdateQuestion($__6) {
        var $__7, $__9, $__10;
        var $__8 = $__6,
            userid = ($__7 = $__8.userid) === void 0 ? '0' : $__7,
            questionid = ($__9 = $__8.questionid) === void 0 ? '0' : $__9,
            categoryid = ($__10 = $__8.categoryid) === void 0 ? '0' : $__10,
            value = $__8.value,
            question = $__8.question,
            answer = $__8.answer;
        return new Promise((function (resolve, reject) {
            porter.questions.update({
                categoryid: categoryid
            }, {
                userid: userid,
                questionid: questionid,
                value: value,
                question: question,
                answer: answer
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function DeleteQuestion($__6) {
        var $__9, $__10, $__8;
        var $__7 = $__6,
            userid = ($__9 = $__7.userid) === void 0 ? '0' : $__9,
            questionid = ($__10 = $__7.questionid) === void 0 ? '0' : $__10,
            categoryid = ($__8 = $__7.categoryid) === void 0 ? '0' : $__8;
        return new Promise((function (resolve, reject) {
            porter.questions.delete({
                categoryid: categoryid
            }, {
                userid: userid,
                questionid: questionid
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }

    function NewQuestion($__6) {
        var $__10, $__8;
        var $__9 = $__6,
            userid = ($__10 = $__9.userid) === void 0 ? '0' : $__10,
            categoryid = ($__8 = $__9.categoryid) === void 0 ? '0' : $__8,
            value = $__9.value,
            question = $__9.question,
            answer = $__9.answer;
        return new Promise((function (resolve, reject) {
            porter.questions.new({
                categoryid: categoryid
            }, {
                value: value,
                question: question,
                answer: answer,
                userid: userid
            }, (function (err, res) {
                if (err) reject(err);
                else resolve(res);
            }));
        }));
    }
    return {
        get UserLogin() {
            return UserLogin;
        }, get UserRegister() {
            return UserRegister;
        }, get GetCategories() {
            return GetCategories;
        }, get DeleteCategory() {
            return DeleteCategory;
        }, get UpdateCategory() {
            return UpdateCategory;
        }, get NewCategory() {
            return NewCategory;
        }, get UpdateQuestion() {
            return UpdateQuestion;
        }, get DeleteQuestion() {
            return DeleteQuestion;
        }, get NewQuestion() {
            return NewQuestion;
        }, __esModule: true
    };
});