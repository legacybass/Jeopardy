"use strict";
Object.defineProperties(exports, {
    Categories: {
        get: function () {
            return Categories;
        }
    },
    Users: {
        get: function () {
            return Users;
        }
    },
    Questions: {
        get: function () {
            return Questions;
        }
    },
    __esModule: {
        value: true
    }
});
var __moduleName = "DataInteraction.es6";
var $__mongoose__, $___46__46__47_public_47_js_47_libs_47_promise__;
var mongoose = ($__mongoose__ = require("mongoose"), $__mongoose__ && $__mongoose__.__esModule && $__mongoose__ || {
default:
    $__mongoose__
}).
default;
var promise = ($___46__46__47_public_47_js_47_libs_47_promise__ = require("../public/js/libs/promise"), $___46__46__47_public_47_js_47_libs_47_promise__ && $___46__46__47_public_47_js_47_libs_47_promise__.__esModule && $___46__46__47_public_47_js_47_libs_47_promise__ || {
default:
    $___46__46__47_public_47_js_47_libs_47_promise__
}).
default;
var ObjectId = mongoose.Schema.ObjectId;
var Categories = ((function () {
    var categoryModel = mongoose.model('Category'),
        userModel = mongoose.model('User');
    return {
        GetCategories: function ($__2) {
            var user = $__2.userId;
            return new Promise((function (resolve, reject) {
                var query = categoryModel.find({
                    'User': user
                });
                query.sort('Value');
                query.exec((function (err, results) {
                    if (err) reject({
                        message: err.message,
                        exception: err
                    });
                    else {
                        resolve(results);
                    }
                }));
            }));
        },
        CreateCategory: (function ($__2) {
            var $__3 = $__2,
                name = $__3.name,
                userId = $__3.userId;
            return new Promise((function (resolve, reject) {
                userModel.findOne({
                    _id: userId
                }).exec((function (err, user) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!user) return reject({
                        message: 'Could not find user'
                    });
                    var category = new categoryModel({
                        Name: name,
                        User: user
                    });
                    category.save((function (err) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        user.Categories.push(category);
                        user.save((function (err) {
                            if (err) return reject({
                                message: err.message,
                                exception: err
                            });
                            resolve(category);
                        }));
                    }));
                }));
            }));
        }),
        UpdateCategory: (function ($__2) {
            var $__3 = $__2,
                userId = $__3.userId,
                categoryId = $__3.categoryId,
                name = $__3.name;
            return new Promise((function (resolve, reject) {
                categoryModel.findOneAndUpdate({
                    'User': userId,
                    '_id': categoryId
                }, {
                    Name: name
                }).exec((function (err, category) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    else resolve(category);
                }));
            }));
        }),
        DeleteCategory: (function ($__2) {
            var $__3 = $__2,
                userId = $__3.userId,
                categoryId = $__3.categoryId;
            return new Promise((function (resolve, reject) {
                categoryModel.findOneAndRemove({
                    'User': userId,
                    '_id': categoryId
                }).exec((function (err, category) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!category) return reject({
                        message: 'Could not find category '
                    });
                    userModel.update({
                        _id: userId
                    }, {
                        '$pull': {
                            Categories: category._id
                        }
                    }, (function (err, count) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        resolve(category);
                    }));
                }));
            }));
        })
    };
}))();
var Users = ((function () {
    var userModel = mongoose.model('User');
    return {
        GetUser: (function ($__2) {
            var $__3 = $__2,
                username = $__3.username,
                password = $__3.password;
            return new Promise((function (resolve, reject) {
                userModel.findOne({
                    Login: username
                }).exec((function (err, user) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!user) return reject({
                        message: 'Could not find user'
                    });
                    user.ComparePassword(password, (function (err, isMatch) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        if (!isMatch) return reject({
                            message: 'Password did not match'
                        });
                        resolve(user);
                    }));
                }));
            }));
        }),
        Register: (function ($__2) {
            var $__3 = $__2,
                username = $__3.username,
                password = $__3.password;
            return new Promise((function (resolve, reject) {
                userModel.find({
                    Login: username
                }).exec((function (err, users) {
                    if (users && users.length > 1) return reject({
                        message: 'A user with that username already exists.'
                    });
                    var newbie = new userModel({
                        Login: username,
                        Password: password
                    });
                    newbie.save((function (err) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        resolve(newbie);
                    }));
                }));
            }));
        })
    };
}))();
var Questions = ((function () {
    var categoryModel = mongoose.model('Category'),
        questionModel = mongoose.model('Question');
    return {
        CreateQuestion: (function ($__2) {
            var $__3 = $__2,
                userId = $__3.userId,
                categoryId = $__3.categoryId,
                value = $__3.value,
                answer = $__3.answer,
                question = $__3.question;
            return new Promise((function (resolve, reject) {
                categoryModel.findOne({
                    _id: categoryId,
                    User: userId
                }).exec((function (err, category) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!category) return reject({
                        message: 'Could not find category'
                    });
                    var questionObj = category.Questions.create({
                        Value: value,
                        Answer: answer,
                        Question: question
                    });
                    category.Questions.push(questionObj);
                    category.save((function (err) {
                        if (err) reject({
                            message: err.message,
                            exception: err
                        });
                        else resolve(questionObj);
                    }));
                }));
            }));
        }),
        UpdateQuestion: (function ($__2) {
            var $__3 = $__2,
                userId = $__3.userId,
                questionId = $__3.questionId,
                categoryId = $__3.categoryId,
                value = $__3.value,
                answer = $__3.answer,
                question = $__3.question;
            return new Promise((function (resolve, reject) {
                categoryModel.findOne({
                    User: userId,
                    _id: categoryId
                }).exec((function (err, category) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!category) return reject({
                        message: 'Could not find category'
                    });
                    var questionObj = category.Questions.id(questionId);
                    if (!questionObj) return reject({
                        message: 'Could not find question'
                    });
                    questionObj.Value = value;
                    questionObj.Answer = answer;
                    questionObj.Question = question;
                    category.save((function (err) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        resolve(questionObj);
                    }));
                }));
            }));
        }),
        DeleteQuestion: (function ($__2) {
            var $__3 = $__2,
                userId = $__3.userId,
                questionId = $__3.questionId,
                categoryId = $__3.categoryId;
            return new Promise((function (resolve, reject) {
                categoryModel.findOne({
                    User: userId,
                    _id: categoryId
                }).exec((function (err, category) {
                    if (err) return reject({
                        message: 'Invalid information',
                        exception: err
                    });
                    if (!category) return reject({
                        message: 'Could not find category'
                    });
                    var question = category.Questions.id(questionId).remove();
                    if (!question) return reject({
                        message: 'Could not find question'
                    });
                    category.save((function (err) {
                        if (err) return reject({
                            message: err.message,
                            exception: err
                        });
                        resolve(question);
                    }));
                }));
            }));
        })
    };
}))();