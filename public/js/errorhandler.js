define(['knockout', 'libs/toastr.min', 'libs/promise', 'jquery'], function ($__0, $__2, $__4, $__6) {
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
    var toastr = $__2.
default;
    var Promise = $__4.
default;
    var jQuery = $__6.
default;
    var defaultToastOptions = {
        'debug': true,
        'positionClass': 'toast-top-right',
        'onclick': null,
        'showDuration': 300,
        'hideDuration': 1000,
        'timeOut': 5000,
        'extendedTimeOut': 1000,
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut'
    };
    var MessageHandler = function MessageHandler() {
        this._Message = ko.observable();
        this._Title = ko.observable();
        this._TimerToken = undefined;
        this._IsShowing = ko.observable(false);
    };
    ($traceurRuntime.createClass)(MessageHandler, {
        Show: function ($__9) {
            var $__11, $__12, $__13;
            var $__10 = $__9,
                message = ($__11 = $__10.message) === void 0 ? '' : $__11,
                title = ($__12 = $__10.title) === void 0 ? '' : $__12,
                level = ($__13 = $__10.level) === void 0 ? 'error' : $__13;
            toastr.options = defaultToastOptions;
            if (toastr[level]) toastr[level](message, title);
            else toastr.info(message, title);
        },
        Confirm: function ($__9) {
            var $__12, $__13, $__10;
            var $__11 = $__9,
                element = $__11.element,
                message = ($__12 = $__11.message) === void 0 ? "Click here to confirm, or click the 'x' to this close toast and cancel" : $__12,
                title = ($__13 = $__11.title) === void 0 ? "Confirm Action" : $__13,
                timeout = ($__10 = $__11.timeout) === void 0 ? 10000 : $__10;
            return new Promise((function (resolve, reject) {
                var isDismissed = false;
                if (element) {
                    jQuery(element).popover('show');
                } else {
                    toastr.options = {
                        'positionClass': 'toast-top-right',
                        'onclick': (function () {
                            isDismissed = true;
                            resolve();
                        }),
                        'onHidden': (function () {
                            if (!isDismissed) {
                                reject();
                            }
                        }),
                        'showDuration': 300,
                        'hideDuration': 1000,
                        'timeOut': timeout,
                        'extendedTimeOut': 0,
                        'showEasing': 'swing',
                        'hideEasing': 'linear',
                        'showMethod': 'fadeIn',
                        'hideMethod': 'fadeOut',
                        'closeButton': true
                    };
                    toastr.warning(message, title);
                }
            }));
        },
        Log: function ($__9) {
            var $__13, $__10;
            var $__12 = $__9,
                message = $__12.message,
                title = ($__13 = $__12.title) === void 0 ? "Log Message" : $__13,
                level = ($__10 = $__12.level) === void 0 ? 'info' : $__10;
            if (level === 'warning') console.warn('%s: %s', title, message);
            else console.info("%s: %s", title, message);
        }
    }, {});
    var $__default = MessageHandler;
    return {
        get
    default () {
            return $__default;
        }, __esModule:
        true
    };
});