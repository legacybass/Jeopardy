define([], function () {
    "use strict";
    var Category = function Category($__1) {
        var $__3, $__4, $__5;
        var $__2 = $__1,
            id = ($__3 = $__2.id) === void 0 ? -1 : $__3,
            name = ($__4 = $__2.name) === void 0 ? 'New Category' : $__4,
            questions = ($__5 = $__2.questions) === void 0 ? [] : $__5;
        this.Id = id;
        this.Name = name;
        this.Questions = questions;
    };
    ($traceurRuntime.createClass)(Category, {
        AddQuestion: function (question) {
            this.Questions.push(question);
        }
    }, {});
    var Question = function Question($__1) {
        var $__4, $__5, $__2, $__6;
        var $__3 = $__1,
            id = ($__4 = $__3.id) === void 0 ? -1 : $__4,
            value = ($__5 = $__3.value) === void 0 ? 200 : $__5,
            question = ($__2 = $__3.question) === void 0 ? 'What is your favorite color' : $__2,
            answer = ($__6 = $__3.answer) === void 0 ? 'Blu... no, yell OOooww!' : $__6;
        this.Id = id;
        this.Value = value;
        this.Question = question;
        this.Answer = answer;
    };
    ($traceurRuntime.createClass)(Question, {}, {});
    return {
        get Category() {
            return Category;
        }, get Question() {
            return Question;
        }, __esModule: true
    };
});