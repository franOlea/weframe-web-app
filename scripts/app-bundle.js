define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
});
define('environment',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,
    webApiUrl: 'http://weframers-franolea.rhcloud.com',
    webApiUsersPath: 'users'
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('components/user-list',['exports', 'aurelia-framework', '../services/user-service'], function (exports, _aureliaFramework, _userService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserList = exports.UserList = (_dec = (0, _aureliaFramework.inject)(_userService.UserService), _dec(_class = function () {
        function UserList(userService) {
            _classCallCheck(this, UserList);

            this.userService = userService;
            this.users = [];
            this.error = {};
            this.isWorking = false;
        }

        UserList.prototype.created = function created() {
            this.updateUserList(0, 10);
        };

        UserList.prototype.updateUserList = function updateUserList(page, size) {
            var _this = this;

            this.isWorking = true;
            this.userService.getUsers(page, size).then(function (userResponse) {
                _this.users = JSON.parse(userResponse.response);
                _this.isWorking = false;
            }, function (errorResponse) {
                _this.error.title = 'Ups';
                _this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                _this.isWorking = false;
            });
        };

        return UserList;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/user-service',['exports', 'aurelia-http-client', '../environment'], function (exports, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserService = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var UserService = exports.UserService = function () {
        function UserService() {
            _classCallCheck(this, UserService);

            this.restClient = new _aureliaHttpClient.HttpClient();
        }

        UserService.prototype.getUsers = function (_getUsers) {
            function getUsers() {
                return _getUsers.apply(this, arguments);
            }

            getUsers.toString = function () {
                return _getUsers.toString();
            };

            return getUsers;
        }(function () {
            return getUsers(0, 10);
        });

        UserService.prototype.getUsers = function getUsers(pageNumber, pageSize) {
            return this.restClient.createRequest(_environment2.default.webApiUsersPath).asGet().withBaseUrl(_environment2.default.webApiUrl).withTimeout(5000).send();
        };

        UserService.prototype.getUser = function getUser(id) {
            return this.restClient.createRequest(_environment2.default.webApiUsersPath + ('/' + id)).asGet().withBaseUrl(_environment2.default.webApiUrl).withTimeout(2000).send();
        };

        UserService.prototype.postUser = function postUser() {
            return this.restClient.createRequest(_environment2.default.webApiUsersPath).asPost().withBaseUrl(_environment2.default.webApiUrl).withContent(user).withTimeout(3000).send();
        };

        return UserService;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./components/user-list\"></require><user-list></user-list></template>"; });
define('text!components/user-list.html', ['module'], function(module) { module.exports = "<template><div class=\"alert alert-danger\" if.bind=\"error.description\"><strong>${error.title}</strong> ${error.description}</div><table class=\"table table-bordered\"><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Rol</th><th>Estado</th></tr><tr repeat.for=\"user of users\"><td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td><td>${user.email}</td><td>${user.role.name}</td><td>${user.state.name}</td></tr></table></template>"; });
//# sourceMappingURL=app-bundle.js.map