define(['knockout', 'knockout.mapping', 'errorhandler', 'dataaccess', 'jeopardyModels', 'bootstrap.min'], function ($__0, $__2, $__4, $__6, $__7, $__9) {
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
    if (!$__6 || !$__6.__esModule) $__6 = {
    default:
        $__6
    };
    if (!$__7 || !$__7.__esModule) $__7 = {
    default:
        $__7
    };
    if (!$__9 || !$__9.__esModule) $__9 = {
    default:
        $__9
    };
    var ko = $__0.
default;
    var mapping = $__2.
default;
    var errorhandler = $__4.
default;
    var dataaccess = $__6;
    var $__8 = $__7,
        Category = $__8.Category,
        Question = $__8.Question;
    var bootstrap = $__9.
default;
    var error = new errorhandler();
    var ManageViewModel = function ManageViewModel($__13) {
        var $__15;
        var $__14 = $__13,
            userid = ($__15 = $__14.userid) === void 0 ? '0' : $__15;
        var $__11 = this;
        if (!(this instanceof $ManageViewModel)) return new $ManageViewModel();
        this.__userid = userid;
        this.__nameRegex = /^[a-zA-Z]( ?[\w]+){3,}$/;
        this.__textRegex = /^.+$/;
        this.__numberRegex = /\d+/;
        this.Categories = ko.observableArray([]);
        this.SelectedCategory = ko.observable();
        this.SelectedQuestion = ko.observable();
        this.NewCategory = ko.observable(mapping.fromJS(new Category({
            name: ''
        })));
        this.NewQuestion = ko.observable(mapping.fromJS(new Question({
            value: '',
            question: '',
            answer: ''
        })));
        this.CategoryEditting = ko.observable(false);
        this.QuestionEditting = ko.observable(false);
        dataaccess.GetCategories({
            userid: userid
        }).then((function (data) {
            if (data.error) return error.Show({
                message: data.message,
                title: 'Could not load categories'
            });
            if (Array.isArray(data)) {
                data.map((function (i) {
                    return mapping.fromJS(i);
                })).forEach((function (i) {
                    return $__11.Categories.push(i);
                }));
            } else {
                console.log("Server returned weird data: %s", JSON.stringify(data));
                error.Show({
                    message: 'The data returned from the server was not valid',
                    title: 'Could not load categories'
                });
            }
        }), (function (error) {
            console.log(error);
            error.Show({
                message: error,
                title: 'Could not load categories'
            });
        }));
    };
    var $ManageViewModel = ManageViewModel;
    ($traceurRuntime.createClass)(ManageViewModel, {
        SelectCategory: function (category) {
            this.SelectedCategory(category);
            this.ClearEditCategory(category);
        },
        SelectQuestion: function (question) {
            this.SelectedQuestion(question);
            this.ClearEditQuestion(question);
        },
        AddCategory: function () {
            var $__11 = this;
            var name = this.NewCategory().Name();
            var editting = this.CategoryEditting();
            if (!this.__nameRegex.test(name)) {
                error.Show({
                    title: 'Invalid Category Name',
                    message: 'Please include a valid name for your category.'
                });
            } else {
                var onError = (function (err) {
                    error.Show({
                        title: 'Error Saving Category',
                        message: 'An error occurred while saving the new category. ' + err.message
                    });
                });
                var onSuccess = (function (res) {
                    if (res.error) {
                        error.Show({
                            title: 'Error Saving Category',
                            message: res.message
                        });
                    } else {
                        if (!editting) $__11.Categories.push(mapping.fromJS(res));
                        else $__11.CategoryEditting(false);
                        $__11.NewCategory(mapping.fromJS(new Category({
                            name: ''
                        })));
                    }
                });
                if (editting) {
                    dataaccess.UpdateCategory({
                        userid: this.__userid,
                        categoryid: this.NewCategory()._id(),
                        name: name
                    }).then(onSuccess, onError);
                } else {
                    dataaccess.NewCategory({
                        userid: this.__userid,
                        name: name
                    }).then(onSuccess, onError);
                }
            }
        },
        EditCategory: function (category) {
            this.CategoryEditting(true);
            this.SelectedCategory(category);
            this.NewCategory(this.SelectedCategory());
        },
        ClearEditCategory: function (category) {
            this.CategoryEditting(false);
            this.NewCategory(mapping.fromJS(new Category({
                name: ''
            })));
        },
        DeleteCategory: function (category, element) {
            var $__11 = this;
            error.Confirm({
                title: 'Confirm Deleting Category'
            }).then((function () {
                if ($__11.SelectedCategory() == category) {
                    $__11.SelectedCategory(undefined);
                }
                dataaccess.DeleteCategory({
                    userid: $__11.__userid,
                    categoryid: category._id()
                }).then((function (res) {
                    if (res.error) {
                        console.log(res);
                        error.Show({
                            message: res.message,
                            title: 'Could not delete category'
                        });
                    } else {
                        $__11.Categories.remove(category);
                        error.Show({
                            title: 'Category successfully deleted.',
                            level: 'success'
                        });
                    }
                }), (function (err) {
                    error.Show({
                        message: err.message,
                        title: 'Could not delete category'
                    });
                }));
            }), (function () {}));
        },
        AddQuestion: function () {
            var $__11 = this;
            var value = this.NewQuestion().Value(),
                question = this.NewQuestion().Question(),
                answer = this.NewQuestion().Answer(),
                questionValid, answerValid, valueValid, category = this.SelectedCategory(),
                editting = this.QuestionEditting();
            if (!(questionValid = this.__textRegex.test(question))) {
                error.Show({
                    title: 'Invalid Question Text',
                    message: 'The new question you have provided is invalid.'
                });
            }
            if (!(answerValid = this.__textRegex.test(answer))) {
                error.Show({
                    title: 'Invalid Answer Text',
                    message: 'The new answer you have provided is invalid.'
                });
            }
            if (!(valueValid = this.__numberRegex.test(value))) {
                error.Show({
                    title: 'Inavlid Value',
                    message: 'The new value you have provided is invalid.'
                });
            }
            if (questionValid && answerValid && valueValid) {
                var onSuccess = (function (res) {
                    if (res.error) error.Show({
                        title: 'Could not create question',
                        message: res.message
                    });
                    else {
                        if (editting) {
                            $__11.QuestionEditting(false);
                        } else {
                            category.Questions.push(mapping.fromJS(res));
                        }
                        $__11.NewQuestion(mapping.fromJS(new Question({
                            value: '',
                            question: '',
                            answer: ''
                        })));
                    }
                });
                var onError = (function (err) {
                    error.Show({
                        title: 'Could not create question',
                        message: err.message
                    });
                });
                var data = {
                    userid: this.__userid,
                    categoryid: category._id(),
                    value: value,
                    answer: answer,
                    question: question
                };
                if (editting) {
                    data.questionid = this.SelectedQuestion()._id();
                    dataaccess.UpdateQuestion(data).then(onSuccess, onError);
                } else {
                    dataaccess.NewQuestion(data).then(onSuccess, onError);
                }
            }
        },
        EditQuestion: function (question) {
            this.QuestionEditting(true);
            this.SelectedQuestion(question);
            this.NewQuestion(this.SelectedQuestion());
        },
        ClearEditQuestion: function (question) {
            this.QuestionEditting(false);
            this.NewQuestion(mapping.fromJS(new Category({
                name: ''
            })));
        },
        DeleteQuestion: function (question) {
            var $__11 = this;
            error.Confirm({
                title: 'Confirm Deleting Question'
            }).then((function () {
                var questionid = question._id(),
                    category = $__11.SelectedCategory(),
                    userid = $__11.__userid;
                dataaccess.DeleteQuestion({
                    userid: userid,
                    questionid: questionid,
                    categoryid: category._id()
                }).then((function (res) {
                    if (res.error) error.Show({
                        title: 'Error deleting question',
                        message: res.message
                    });
                    else {
                        category.Questions.remove(question);
                        error.Show({
                            title: 'Question successfully deleted.',
                            level: 'success'
                        });
                    }
                }), (function (err) {
                    error.Show({
                        title: 'Error deleting question',
                        message: err.message
                    });
                }));
            }), (function () {}));
        }
    }, {});
    var $__default = ManageViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});