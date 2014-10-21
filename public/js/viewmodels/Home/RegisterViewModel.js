define(['knockout', 'errorhandler'], function ($__0, $__2) {
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
    var ErrorHandler = $__2.
default;
    var errorHandler = new ErrorHandler();
    var RegisterViewModel = function RegisterViewModel() {
        this.Username = ko.observable();
        this.Password = ko.observable();
        this.Confirm = ko.observable();
        this.Valid = ko.observable();
        this.Loading = ko.observable(false);
    };
    ($traceurRuntime.createClass)(RegisterViewModel, {
        Submit: function (form) {
            var valid = true;
            if (!this.Username()) {
                errorHandler.Show({
                    message: 'Username cannot be blank.',
                    title: 'Invalid Username'
                });
                valid = false;
            }
            if (!this.Password()) {
                errorHandler.Show({
                    message: 'Password cannot be blank.',
                    title: 'Invalid Password'
                });
                valid = false;
            } else if (this.Password() != this.Confirm()) {
                errorHandler.Show({
                    message: 'Your passwords do not match.',
                    title: 'Password Mismatch'
                });
                valid = false;
            }
            this.Valid(valid);
            this.Loading(true);
            return valid;
        }
    }, {});
    var $__default = RegisterViewModel;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});