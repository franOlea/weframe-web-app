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
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-validation');

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

        UserService.prototype.postUser = function postUser(user) {
            return this.restClient.createRequest(_environment2.default.webApiUsersPath).asPost().withBaseUrl(_environment2.default.webApiUrl).withContent(user).withTimeout(3000).send();
        };

        return UserService;
    }();
});
define('components/user/user-list',['exports', 'aurelia-framework', '../../services/user-service'], function (exports, _aureliaFramework, _userService) {
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
define('components/user/user-registration',['exports', 'aurelia-framework', 'aurelia-validation', '../../services/user-service'], function (exports, _aureliaFramework, _aureliaValidation, _userService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserRegistration = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserRegistration = exports.UserRegistration = (_dec = (0, _aureliaFramework.inject)(_userService.UserService, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function UserRegistration(userService, validationController) {
            _classCallCheck(this, UserRegistration);

            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';

            this.userService = userService;
            this.validationController = validationController;
            this.isWorking = false;
            this.success = false;
            this.serverError = {};
        }

        UserRegistration.prototype.created = function created() {
            this.validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;

            _aureliaValidation.ValidationRules.ensure("firstName").required().withMessage("El nombre no puede estar vacio.").ensure("lastName").required().withMessage("El apellido no puede estar vacio.").ensure("email").email().required().withMessage("El email no es valido, por favor ingrese un email valido.").ensure("password").minLength(8).required().withMessage("La contraseña debe tener al menos 8 caracteres").on(this);
        };

        UserRegistration.prototype.register = function register() {
            var _this = this;

            this.success = false;
            this.isWorking = true;

            var user = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password
            };

            setTimeout(function () {
                _this.validationController.validate().then(function (validation) {
                    if (validation.valid) {
                        _this.success = true;
                    }
                }).then(function () {
                    return _this.isWorking = false;
                });
            }, 1000);
        };

        UserRegistration.prototype.postUser = function postUser(user) {
            var _this2 = this;

            this.userService.postUser(user).then(function () {
                _this2.success = true;
            }, function (failure) {
                var failureMessage = JSON.parse(failure.response);
                _this2.serverError = {
                    title: failureMessage.title,
                    description: failureMessage.description
                };
            }).then(function () {
                return _this2.isWorking = false;
            });
        };

        return UserRegistration;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./components/user/user-list\"></require><require from=\"./components/user/user-registration\"></require><user-list></user-list><user-registration></user-registration></template>"; });
define('text!components/user/user-list.html', ['module'], function(module) { module.exports = "<template><div class=\"alert alert-danger\" if.bind=\"error.description\"><strong>${error.title}</strong> ${error.description}</div><table class=\"table table-bordered\"><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Rol</th><th>Estado</th></tr><tr repeat.for=\"user of users\"><td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td><td>${user.email}</td><td>${user.role.name}</td><td>${user.state.name}</td></tr></table></template>"; });
define('text!components/user/user-registration.html', ['module'], function(module) { module.exports = "<template><form role=\"form\" submit.delegate=\"register()\"><div class=\"form-group\"><label for=\"firstName\">Nombre:</label><input type=\"text\" class=\"form-control\" value.bind=\"firstName & validate\" placeholder=\"ej: Juan\"></div><div class=\"form-group\"><label for=\"lastName\">Apellido:</label><input type=\"text\" class=\"form-control\" value.bind=\"lastName & validate\" placeholder=\"ej: Perez\"></div><div class=\"form-group\"><label for=\"email\">Email:</label><input type=\"email\" class=\"form-control\" value.bind=\"email & validate\" placeholder=\"ej: juan.perez@email.com\"></div><div class=\"form-group\"><label for=\"password\">Contraseña:</label><input type=\"password\" class=\"form-control\" value.bind=\"password & validate\"></div><div class=\"form-group\"><div class=\"alert alert-warning\" repeat.for=\"error of validationController.errors\">${error.message}</div><div class=\"alert alert-danger\" if.bind=\"serverError.title\"><strong>${serverError.title}</strong> ${serverError.description}</div><div class=\"alert alert-success\" if.bind=\"success\"><strong>Exito!</strong> El usuario fue registrado correctamente.</div></div><button type=\"submit\" class=\"btn btn-primary\" if.bind=\"!isWorking\">Registrar</button> <button type=\"submit\" class=\"btn btn-primary disabled\" if.bind=\"isWorking\"><i class=\"fa fa-spinner fa-spin\"></i> Enviando...</button></form></template>"; });
//# sourceMappingURL=app-bundle.js.map