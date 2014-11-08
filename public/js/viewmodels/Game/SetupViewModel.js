define(['knockout', 'dataaccess', 'errorhandler', 'router'], function ($__0, $__2, $__3, $__5) {
    "use strict";
    if (!$__0 || !$__0.__esModule) $__0 = {
    default:
        $__0
    };
    if (!$__2 || !$__2.__esModule) $__2 = {
    default:
        $__2
    };
    if (!$__3 || !$__3.__esModule) $__3 = {
    default:
        $__3
    };
    if (!$__5 || !$__5.__esModule) $__5 = {
    default:
        $__5
    };
    var ko = $__0.
default;
    var loader = $__2;
    var ErrorHandler = $__3.
default;
    var router = $__5;
    var SetupViewModel = function SetupViewModel($__8) {
        var $__10, $__11, $__12, $__13, $__14, $__15, $__16, $__17;
        var $__9 = $__8,
            onlineGame = ($__10 = $__9.onlineGame) === void 0 ? true : $__10,
            gameName = $__9.gameName,
            hasRequired = ($__11 = $__9.hasRequired) === void 0 ? false : $__11,
            categories = ($__12 = $__9.categories) === void 0 ? [] : $__12,
            chosenCategories = ($__13 = $__9.chosenCategories) === void 0 ? [] : $__13,
            userId = $__9.userId,
            questionCounter = ($__14 = $__9.questionCounter) === void 0 ? 10 : $__14,
            contestantCounter = ($__15 = $__9.contestantCounter) === void 0 ? 10 : $__15,
            maxQuestion = ($__16 = $__9.maxQuestion) === void 0 ? 120 : $__16,
            maxContestant = ($__17 = $__9.maxContestant) === void 0 ? 120 : $__17;
        var $__6 = this;
        if (!(this instanceof $SetupViewModel)) return new $SetupViewModel();
        var categoriesLoaded = false;
        this._ErrorHandler = new ErrorHandler();
        this.Title = ko.observable('Jeopardy Setup');
        this.OnlineGame = ko.observable(onlineGame);
        this.GameName = ko.observable(gameName);
        this.HasRequired = ko.observable(hasRequired);
        this.Categories = ko.observableArray(categories);
        this.ChosenCategories = ko.observableArray(chosenCategories);
        this.QuestionCounter = ko.observable(questionCounter);
        this.ContestantCounter = ko.observable(contestantCounter);
        this.Loading = ko.observable(false);
        this.GameNameValid = ko.computed((function () {
            return !!$__6.GameName() && /^[a-zA-Z][a-zA-Z0-9]{2,}$/.test($__6.GameName());
        }));
        this.QuestionCounterValid = ko.computed((function () {
            return $__6.QuestionCounter() > 0 && $__6.QuestionCounter() < maxQuestion;
        }));
        this.ContestantCounterValid = ko.computed((function () {
            return $__6.ContestantCounter() > 0 && $__6.ContestantCounter() < maxContestant;
        }));
        this.HasRequired.subscribe((function (val) {
            if ( !! val && !categoriesLoaded) {
                loader.GetCategories({
                    userid: userId
                }).then((function (categories) {
                    $__6.Categories(categories.map((function (n) {
                        return n.Name;
                    })));
                    categoriesLoaded = true;
                }), (function (error) {
                    errorHandler.Show({
                        message: error,
                        title: "Failed to load categories from database.",
                        level: 'error'
                    });
                }));
            }
        }));
    };
    var $SetupViewModel = SetupViewModel;
    ($traceurRuntime.createClass)(SetupViewModel, {
        SetupGame: function () {
            if (!this.GameNameValid()) this._ErrorHandler.Show({
                title: 'Invalid Name',
                message: 'Please enter a valid name for your game.',
                level: 'error'
            });
            else {
                this.Loading(true);
                return true;
            }
        },
        Serialize: function () {
            return {
                OnlineGame: this.OnlineGame(),
                GameName: this.GameName(),
                HasRequired: this.HasRequired(),
                Categories: this.ChosenCategories()
            };
        }
    }, {});
    var $__default = SetupViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});