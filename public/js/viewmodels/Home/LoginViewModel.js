define(['knockout'], function ($__0) {
    "use strict";
    if (!$__0 || !$__0.__esModule) $__0 = {
    default:
        $__0
    };
    var ko = $__0.
default;
    var LoginViewModel = function LoginViewModel() {
        if (!(this instanceof $LoginViewModel)) return new $LoginViewModel();
        this.Username = ko.observable();
        this.Password = ko.observable();
        this.Loading = ko.observable(false);
    };
    var $LoginViewModel = LoginViewModel;
    ($traceurRuntime.createClass)(LoginViewModel, {
        Submit: function () {
            this.Loading(true);
            return true;
        }
    }, {});
    var $__default = LoginViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});