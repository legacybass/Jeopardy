"use strict";
Object.defineProperties(exports, {
default:
    {
        get: function () {
            return $__default;
        }
    }, __esModule: {
        value: true
    }
});
var __moduleName = "HomeController.es6";

function Bootstrap(router) {
    router.get('/', function (req, res, next) {
        res.render('Home/Index', {});
    });
    router.get('/Contestant', function (req, res, next) {
        res.render('/Contestant', {});
    });
}
var $__default = Bootstrap;