define(['sammy', 'libs/sammy.json', 'libs/sammy.storage', 'HomeController', 'GameController', 'DataController', 'ContestantController'], function ($__0, $__2, $__4, $__6, $__7, $__8, $__9) {
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
    if (!$__8 || !$__8.__esModule) $__8 = {
    default:
        $__8
    };
    if (!$__9 || !$__9.__esModule) $__9 = {
    default:
        $__9
    };
    var sammy = $__0.
default;
    var sammyJson = $__2.
default;
    var sammyStorage = $__4.
default;
    var Home = $__6;
    var Game = $__7;
    var Data = $__8;
    var Contestant = $__9;
    var app = undefined;

    function SetupRoutes() {
        var main = arguments[0] !== (void 0) ? arguments[0] : '#main';
        app = sammy(main, function () {
            this.debug = true;
            this.use('Session');
            this.CheckValidUser = CheckValidUser;
            this.get(/^\/?#\/?$/, (function (ctx) {
                return Home.Page(ctx, 'Index');
            }));
            this.get('#/Home/Login', (function (ctx) {
                return Home.Page(ctx, 'Login');
            }));
            this.get('#/Home/Register', (function (ctx) {
                return Home.Page(ctx, 'Register');
            }));
            this.get('#/Game/Setup', Game.Setup);
            this.get('#/Game/Play', Game.Play);
            this.get('#/Data/Manage', Data.Manage);
            this.get('#/Contestant/Login', Contestant.Login);
            this.post('#/Home/Login', Home.Login);
            this.post('#/Home/Register', Home.Register);
            this.post('#/Game/Setup', (function (context) {
                return context.redirect("#/Game/Play");
            }));
            this.post('#/Game/Play', Game.Play);
        });
    }

    function Start() {
        var startPage = arguments[0] !== (void 0) ? arguments[0] : '#/';
        app.run(startPage);
    }

    function Navigate() {
        var url = arguments[0] !== (void 0) ? arguments[0] : '';
        var data = arguments[1];
        if (data) {
            Post(url, data);
        } else {
            Get(url);
        }
    }

    function Get() {
        var url = arguments[0] !== (void 0) ? arguments[0] : '';
        app.runRoute('get', '#/' + url);
    }

    function Post() {
        var url = arguments[0] !== (void 0) ? arguments[0] : '';
        var data = arguments[1] !== (void 0) ? arguments[1] : {};
        app.runRoute('post', '#/' + url, data);
    }

    function Put() {
        var url = arguments[0] !== (void 0) ? arguments[0] : '';
        var data = arguments[1] !== (void 0) ? arguments[1] : {};
        app.runRoute('put', '#/' + url, data);
    }

    function Delete() {
        var url = arguments[0] !== (void 0) ? arguments[0] : '';
        var data = arguments[1] !== (void 0) ? arguments[1] : {};
        app.runRoute('del', '#/' + url, data);
    }

    function Host() {
        return window.location.origin || (window.location.protocol + "//" + window.location.host);
    }

    function CheckValidUser() {
        var token = app.session('timeout'),
            date = new Date(token),
            now = new Date(Date.now()),
            user = app.session('user');
        return user && token && now < date;
    }
    return {
        get SetupRoutes() {
            return SetupRoutes;
        }, get Start() {
            return Start;
        }, get Navigate() {
            return Navigate;
        }, get Get() {
            return Get;
        }, get Post() {
            return Post;
        }, get Put() {
            return Put;
        }, get Delete() {
            return Delete;
        }, get Host() {
            return Host;
        }, get CheckValidUser() {
            return CheckValidUser;
        }, __esModule: true
    };
});