define(['knockout', 'errorhandler', 'dataaccess'], function ($__0, $__2, $__4) {
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
    var ko = $__0.
default;
    var ErrorHandler = $__2.
default;
    var dataLoader = $__4;
    var errorHandler = new ErrorHandler();
    var GameViewModel = function GameViewModel($__7) {
        var $__9, $__10, $__11;
        var $__8 = $__7,
            name = ($__9 = $__8.Name) === void 0 ? 'MyGame' : $__9,
            categories = ($__10 = $__8.ChosenCategories) === void 0 ? [] : $__10,
            online = ($__11 = $__8.OnlineGame) === void 0 ? true : $__11,
            Userid = $__8.Userid;
        var $__5 = this;
        if (!(this instanceof $GameViewModel)) return new $GameViewModel();
        this.Title = ko.observable(name);
        this.Categories = ko.observableArray([]);
        dataLoader.GetCategories({
            required: categories,
            userid: Userid
        }).then((function (data) {
            if (data.error) {
                errorHandler.Show({
                    message: data.message,
                    title: 'Error Loading Categories'
                });
            } else if (Array.isArray(data)) {
                data.forEach((function (n) {
                    $__5.Categories.push(n);
                }));
            }
        }), (function (err) {
            errorHandler.Show({
                message: 'Could not load categories for this game. ' + err,
                title: 'Error Loading Categories'
            });
        }));
    };
    var $GameViewModel = GameViewModel;
    ($traceurRuntime.createClass)(GameViewModel, {
        SelectQuestion: function (question, element) {
            console.log('Selected question %s', question.Question);
        }
    }, {});
    var $__default = GameViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});