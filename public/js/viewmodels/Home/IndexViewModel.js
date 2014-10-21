define(['knockout', 'router'], function ($__0, $__2) {
    "use strict";
    if (!$__0 || !$__0.__esModule) $__0 = {
    default:
        $__0
    };
    if (!$__2 || !$__2.__esModule) $__2 = {
    default:
        $__2
    };
    var ko = $__0.
default;
    var router = $__2;
    var HomeViewModel = function HomeViewModel() {
        if (!(this instanceof $HomeViewModel)) return new $HomeViewModel();
        this.Title = ko.observable('Jeopardy!');
    };
    var $HomeViewModel = HomeViewModel;
    ($traceurRuntime.createClass)(HomeViewModel, {}, {});
    var $__default = HomeViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});