define(['knockout', 'knockout.mapping', 'errorhandler', 'jeopardy'], function ($__0, $__2, $__4, $__6) {
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
    var ko = $__0.
default;
    var mapping = $__2.
default;
    var ErrorHandler = $__4.
default;
    var jeopardy = $__6.
default;
    var errorHandler = new ErrorHandler();
    var PlayViewModel = function PlayViewModel($__10) {
        var $__12, $__13, $__14, $__15, $__16;
        var $__11 = $__10,
            name = ($__12 = $__11.Name) === void 0 ? 'MyGame' : $__12,
            questionCount = ($__13 = $__11.questionCount) === void 0 ? 10 : $__13,
            contestantCount = ($__14 = $__11.contestantCount) === void 0 ? 10 : $__14,
            categories = ($__15 = $__11.ChosenCategories) === void 0 ? [] : $__15,
            online = ($__16 = $__11.OnlineGame) === void 0 ? true : $__16,
            Userid = $__11.Userid;
        var $__8 = this;
        if (!(this instanceof $PlayViewModel)) return new $PlayViewModel();
        this.Title = ko.observable(name);
        this.Categories = ko.observableArray([]);
        this.Status = ko.observable('Disconnected');
        this.Loading = ko.observable(true);
        this.GameName = ko.observable(name);
        this.Id = ko.observable();
        this.SelectedQuestion = ko.observable();
        this._contestantCount = contestantCount;
        this._contestant;
        this.__game = new jeopardy({
            name: name,
            questionCount: questionCount,
            contestantCount: contestantCount,
            onTimeout: this.QuestionTimeout.bind(this),
            onTimerChanged: (function (time) {
                console.log("Time left in question: %s", time);
            }),
            onBuzzIn: this.ContestantBuzzIn.bind(this),
            onError: errorHandler.Show.bind(errorHandler),
            onConnectionChange: (function (status) {
                $__8.Status(status);
            }),
            onInformation: (function ($__11) {
                var message = $__11.message;
                errorHandler.show({
                    message: message,
                    title: '',
                    level: 'info'
                });
            }),
            userId: Userid
        });
        this.__game.Load({
            name: name,
            required: categories,
            userId: Userid
        }).then((function () {
            var data = arguments[0] !== (void 0) ? arguments[0] : {};
            if (data.error) {
                errorHandler.Show({
                    message: data.message,
                    title: 'Error Loading Categories'
                });
            } else if (Array.isArray(data.categories)) {
                $__8.Id(data.id);
                data.categories.forEach((function (n) {
                    if (Array.isArray(n.Questions)) n.Questions.forEach((function (m) {
                        m.isAnswered = ko.observable(false);
                    }));
                    $__8.Categories.push(mapping.fromJS(n));
                }));
            } else {
                errorHandler.Show({
                    message: 'An internal error occurred on the server.',
                    title: 'Error Loading Categories'
                });
            }
        }), (function (err) {
            errorHandler.Log({
                message: err.message,
                level: 'warning'
            });
            errorHandler.Show({
                message: 'Could not load categories for this game. ' + err.message,
                title: 'Error Loading Categories'
            });
        }));
    };
    var $PlayViewModel = PlayViewModel;
    ($traceurRuntime.createClass)(PlayViewModel, {
        SelectQuestion: function (question) {
            errorHandler.Log('Selected question %s', question.Question);
            this.__game.SelectQuestion({
                question: question
            });
            this.SelectedQuestion(question);
        },
        AnswerQuestion: function (isCorrect) {
            this.__game.AnswerQuestion({
                response: isCorrect
            });
            if (isCorrect) {
                var question = this.SelectedQuestion();
                question.isAnswered(true);
                this.SelectedQuestion(undefined);
            } else {}
        },
        QuestionTimeout: function () {
            if (this._contestant) {
                alert(this._contestant + " timed out.");
            } else {
                alert("Question timed out!");
                var question = this.SelectedQuestion();
                question.isAnswered(true);
                this.SelectedQuestion(undefined);
            }
        },
        UpdateTimer: function (count) {
            errorHandler.Log({
                message: count + ' seconds left'
            });
        },
        ContestantBuzzIn: function ($__10) {
            var player = $__10.player;
            var $__8 = this;
            errorHandler.Show({
                message: player + " buzzed in!",
                title: 'Contestant Buzzed In'
            });
            errorHandler.Confirm({
                message: 'Click here to indicate a correct answer. Close the toast or wait until timeout to indicate an incorrect answer.',
                title: 'Did they answer correctly?',
                timeout: this._contestantCount
            }).then((function () {
                $__8.__game.AnswerQuestion({
                    response: true
                });
            }), (function () {
                $__8.__game.AnswerQuestion({
                    response: false
                });
            }));
            this._contestant = player;
        },
        NavigateAway: function () {
            this.__game.close();
        }
    }, {});
    var $__default = PlayViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});