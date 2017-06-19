define('app',['exports', 'aurelia-framework', './services/auth-service'], function (exports, _aureliaFramework, _authService) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.App = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_authService.AuthService), _dec(_class = function () {
		App.prototype.configureRouter = function configureRouter(config, router) {
			config.title = 'WeFrame';
			config.map([{
				route: ['', '/'],
				moduleId: './components/frame/frame-gallery',
				title: 'Marcos',
				name: 'index'
			}, {
				route: 'frame-admin-list',
				moduleId: './components/frame/frame-list',
				title: 'Panel de administrador',
				name: 'frame-admin-list'
			}, {
				route: 'frame-admin',
				moduleId: './layouts/frame-admin-panel-layout',
				title: 'Panel de administrador',
				name: 'frame-admin'
			}, {
				route: 'user-admin-list',
				moduleId: './components/user/user-list',
				title: 'Panel de administrador',
				name: 'user-admin-list'
			}, {
				route: 'callback',
				name: 'callback',
				moduleId: './components/callback',
				nav: false,
				title: 'Callback'
			}]);

			this.router = router;
		};

		function App(authService) {
			var _this = this;

			_classCallCheck(this, App);

			this.authService = authService;
			this.authenticated = this.authService.isAuthenticated();
			this.authService.authNotifier.subscribe('authChange', function (authState) {
				_this.authenticated = authState.authenticated;
			});
		}

		App.prototype.login = function login() {
			this.authService.login();
		};

		App.prototype.logout = function logout() {
			this.authService.logout();
		};

		return App;
	}()) || _class);
});
define('environment',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,

    webApiUrl: 'http://localhost:8080',
    webApiUsersPath: 'users',
    webApiPicturesPath: 'pictures',
    webApiFramesPath: 'frames'
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
define('layouts/frame-admin-panel-layout',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FrameAdminPanelLayout = exports.FrameAdminPanelLayout = function FrameAdminPanelLayout() {
        _classCallCheck(this, FrameAdminPanelLayout);
    };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/auth-service',['exports', 'auth0-js', 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator'], function (exports, _auth0Js, _aureliaFramework, _aureliaRouter, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AuthService = undefined;

    var _auth0Js2 = _interopRequireDefault(_auth0Js);

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

    var _dec, _class;

    var AuthService = exports.AuthService = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
        function AuthService(Router) {
            _classCallCheck(this, AuthService);

            this.auth0 = new _auth0Js2.default.WebAuth({
                domain: 'weframe.auth0.com',
                clientID: '7DJzxL1JidZ8QNiGDt8d05183roJGIfJ',
                redirectUri: 'http://localhost:9000/callback',
                audience: 'https://weframe.auth0.com/userinfo',
                responseType: 'token id_token',
                scope: 'openid'
            });
            this.authNotifier = new _aureliaEventAggregator.EventAggregator();

            this.router = Router;
        }

        AuthService.prototype.login = function login() {
            this.auth0.authorize();
        };

        AuthService.prototype.handleAuthentication = function handleAuthentication() {
            var _this = this;

            this.auth0.parseHash(function (err, authResult) {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    _this.setSession(authResult);
                    _this.router.navigate('home');
                    _this.authNotifier.publish('authChange', { authenticated: true });
                } else if (err) {
                    console.log(err);
                }
            });
        };

        AuthService.prototype.setSession = function setSession(authResult) {
            var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);
        };

        AuthService.prototype.logout = function logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            this.router.navigate('home');
            this.authNotifier.publish('authChange', false);
        };

        AuthService.prototype.isAuthenticated = function isAuthenticated() {
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        };

        return AuthService;
    }()) || _class);
});
define('services/frame-service',['exports', 'aurelia-framework', './rest-service', '../environment'], function (exports, _aureliaFramework, _restService, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameService = undefined;

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

    var _dec, _class;

    var FrameService = exports.FrameService = (_dec = (0, _aureliaFramework.inject)(_restService.RestService), _dec(_class = function () {
        function FrameService(restService) {
            _classCallCheck(this, FrameService);

            this.restService = restService;
        }

        FrameService.prototype.getFrames = function getFrames(pageNumber, pageSize) {
            var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;

            return this.restService.getClient().createRequest(_environment2.default.webApiFramesPath).withHeader('page', pageNumber).withHeader('size', pageSize).asGet().withTimeout(timeout).send();
        };

        FrameService.prototype.getFrame = function getFrame(id) {
            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

            return this.restService.getClient().createRequest(_environment2.default.webApiFramesPath + ('/' + id)).asGet().withTimeout(timeout).send();
        };

        FrameService.prototype.postFrame = function postFrame(frame) {
            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

            return this.restService.getClient().createRequest(_environment2.default.webApiFramesPath).asPost().withContent(frame).withTimeout(timeout).send();
        };

        FrameService.prototype.deleteFrame = function deleteFrame(id) {
            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

            return this.restService.getClient().createRequest(_environment2.default.webApiFramesPath + ('/' + id)).asDelete().withTimeout(timeout).send();
        };

        return FrameService;
    }()) || _class);
});
define('services/picture-service',['exports', 'aurelia-http-client', '../environment'], function (exports, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PictureService = undefined;

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

    var PictureService = exports.PictureService = function () {
        function PictureService() {
            _classCallCheck(this, PictureService);

            this.restClient = new _aureliaHttpClient.HttpClient();
        }

        PictureService.prototype.getPicture = function getPicture(uniquePictureName, isOriginalSize) {
            return this.restClient.createRequest(_environment2.default.webApiPicturesPath).asGet().withParams({
                uniqueName: uniquePictureName,
                original: isOriginalSize
            }).withBaseUrl(_environment2.default.webApiUrl).withTimeout(5000).send();
        };

        PictureService.prototype.putPicture = function putPicture(uniqueName, file, formatName, onProgress) {
            var formData = new FormData();
            formData.append('uniqueName', uniqueName);
            formData.append('file', file);
            formData.append('formatName', formatName);

            return this.restClient.createRequest(_environment2.default.webApiPicturesPath).asPost().withContent(formData).withBaseUrl(_environment2.default.webApiUrl).withProgressCallback(function (evt) {
                return console.log(evt);
            }).send();
        };

        return PictureService;
    }();
});
define('services/rest-service',['exports', 'aurelia-http-client', '../environment'], function (exports, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RestService = undefined;

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

    var RestService = exports.RestService = function () {
        function RestService() {
            _classCallCheck(this, RestService);

            this.httpClient = new _aureliaHttpClient.HttpClient().configure(function (x) {
                x.withBaseUrl(_environment2.default.webApiUrl);
            });
        }

        RestService.prototype.setAuthorizationHeader = function setAuthorizationHeader(authorizationHeader) {
            this.httpClient.configure(function (x) {
                x.withHeader('Authorization', authorizationHeader);
            });
        };

        RestService.prototype.getClient = function getClient() {
            return this.httpClient;
        };

        return RestService;
    }();
});
define('services/session-service',['exports', 'aurelia-framework', './rest-service', '../environment'], function (exports, _aureliaFramework, _restService, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SessionService = undefined;

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

    var _dec, _class;

    var SessionService = exports.SessionService = (_dec = (0, _aureliaFramework.inject)(_restService.RestService), _dec(_class = function () {
        function SessionService(restService) {
            _classCallCheck(this, SessionService);

            this.restService = restService;
        }

        SessionService.prototype.setCookie = function setCookie(cookieName, cookieValue, expirationDays) {
            var date = new Date();
            date.setDate(date.getDate() + expirationDays * 24 * 60 * 60 * 1000);
            var expires = "expires=" + date.toUTCString();
            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
        };

        SessionService.prototype.getCookie = function getCookie(cookieName) {
            var nameEQ = cookieName + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        };

        SessionService.prototype.login = function login(userCredentials) {
            return this.restService.getClient().createRequest('login').asPost().withContent(userCredentials).withTimeout(3000).send().then(function (success) {
                console.log("SESSION SERVICE SUCCESS");
                console.log(success);
            }, function (failue) {
                console.log("SESSION SERVICE FAIL");
                console.log(failure);
            });
        };

        return SessionService;
    }()) || _class);
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
define('components/frame/frame-detail-modal',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameDetailModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FrameDetailModal = exports.FrameDetailModal = function FrameDetailModal() {
        _classCallCheck(this, FrameDetailModal);
    };
});
define('components/frame/frame-gallery',['exports', 'aurelia-framework', '../../services/frame-service', '../../services/picture-service'], function (exports, _aureliaFramework, _frameService, _pictureService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameGallery = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var FrameGallery = exports.FrameGallery = (_dec = (0, _aureliaFramework.inject)(_frameService.FrameService, _pictureService.PictureService), _dec(_class = function () {
        function FrameGallery(frameService, pictureService) {
            _classCallCheck(this, FrameGallery);

            this.frameService = frameService;
            this.pictureService = pictureService;
            this.frames = [];
            this.framesPerRow = 6;
            this.error = {};
            this.isWorking = false;
        }

        FrameGallery.prototype.created = function created() {
            this.updateFrameList(1, 10);
        };

        FrameGallery.prototype.updateFrameList = function updateFrameList(page, size) {
            var _this = this;

            this.isWorking = true;
            this.frameService.getFrames(page, size).then(function (frameResponse) {
                _this.frames = _this.frames.concat(JSON.parse(frameResponse.response));
                _this.frameRows = Math.ceil(_this.frames.length / _this.framesPerRow);
                _this.frames.forEach(function (frame) {
                    _this.pictureService.getPicture(frame.picture.imageKey, false).then(function (pictureResponse) {
                        frame.picture = JSON.parse(pictureResponse.response);
                    }, function (failure) {
                        console.log(failure);
                    });
                }, _this);
                _this.isWorking = false;
            }, function (errorResponse) {
                _this.error.title = 'Ups';
                _this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                _this.isWorking = false;
            });
        };

        return FrameGallery;
    }()) || _class);
});
define('components/frame/frame-list',['exports', 'aurelia-framework', '../../services/frame-service', '../../services/picture-service'], function (exports, _aureliaFramework, _frameService, _pictureService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var FrameList = exports.FrameList = (_dec = (0, _aureliaFramework.inject)(_frameService.FrameService, _pictureService.PictureService), _dec(_class = function () {
        function FrameList(frameService, pictureService) {
            _classCallCheck(this, FrameList);

            this.frameService = frameService;
            this.pictureService = pictureService;

            this.error = {};
            this.isWorking = false;
        }

        FrameList.prototype.created = function created() {
            this.updateFrameList(0, 10);
        };

        FrameList.prototype.updateFrameList = function updateFrameList(page, size) {
            var _this = this;

            this.isWorking = true;
            this.frameService.getFrames(page, size).then(function (frameResponse) {
                _this.frames = JSON.parse(frameResponse.response);
                _this.isWorking = false;
            }, function (errorResponse) {
                _this.error.title = 'Ups';
                _this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                _this.isWorking = false;
            });
        };

        FrameList.prototype.showDetails = function showDetails(frameId) {
            this.frames.forEach(function (frame) {
                var _this2 = this;

                if (frame.id == frameId) {
                    this.selectedFrame = frame;
                    this.pictureService.getPicture(this.selectedFrame.picture.imageKey, true).then(function (success) {
                        _this2.selectedFrame.picture.imageUrl = JSON.parse(success.response).imageUrl;
                        _this2.frameDetailsViewModel.frame = JSON.parse(JSON.stringify(_this2.selectedFrame));
                        console.log(_this2.frameDetailsViewModel);
                    }, function (failure) {
                        console.log(failure);
                    });
                }
            }, this);
        };

        return FrameList;
    }()) || _class);
});
define('components/frame/frame-thumbnail',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameThumbnail = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor;

    var FrameThumbnail = exports.FrameThumbnail = (_class = function () {
        function FrameThumbnail() {
            _classCallCheck(this, FrameThumbnail);

            _initDefineProp(this, 'frame', _descriptor, this);
        }

        FrameThumbnail.prototype.created = function created() {};

        FrameThumbnail.prototype.attached = function attached() {};

        FrameThumbnail.prototype.setHasLoaded = function setHasLoaded() {
            this.hasLoaded = true;
        };

        return FrameThumbnail;
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'frame', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('components/frame/frame-update-data-form',['exports', 'aurelia-framework', 'aurelia-validation', '../../services/frame-service'], function (exports, _aureliaFramework, _aureliaValidation, _frameService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameUpdateDataForm = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var FrameUpdateDataForm = exports.FrameUpdateDataForm = (_dec = (0, _aureliaFramework.inject)(_frameService.FrameService, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = (_class2 = function () {
        function FrameUpdateDataForm(frameService, validationController) {
            _classCallCheck(this, FrameUpdateDataForm);

            _initDefineProp(this, 'frame', _descriptor, this);

            this.frameService = frameService;
            this.validationController = validationController;
            this.isWorking = false;
            this.success = false;
            this.serverError = {};
        }

        FrameUpdateDataForm.prototype.created = function created() {
            this.validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;

            _aureliaValidation.ValidationRules.ensure("frame.name").required().withMessage("El nombre unico no puede estar vacio.").ensure("frame.description").required().withMessage("La descripcion no puede estar vacia.").ensure("frame.height").required().satisfies(function (value) {
                return value > 0;
            }).withMessage("El alto del marco no puede estar vacio o ser menor a 0.").ensure("frame.length").required().satisfies(function (value) {
                return value > 0;
            }).withMessage("El ancho del marco no puede estar vacio o ser menor a 0.").ensure("frame.prive").required().satisfies(function (value) {
                return value > 0;
            }).withMessage("El precio del marco no puede estar vacio o ser menor a 0.").on(this);
        };

        FrameUpdateDataForm.prototype.upload = function upload() {
            var _this = this;

            this.success = false;
            this.isWorking = true;

            console.log(this.imageFiles);

            this.validationController.validate().then(function (validation) {
                if (validation.valid) {
                    setTimeout(function () {
                        _this.success = true;
                    }, 1000).then(function () {
                        return _this.isWorking = false;
                    });
                } else {
                    _this.isWorking = false;
                }
            });
        };

        return FrameUpdateDataForm;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'frame', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('components/frame/frame-upload-form',['exports', 'aurelia-framework', 'aurelia-validation', '../../services/picture-service', '../../services/frame-service'], function (exports, _aureliaFramework, _aureliaValidation, _pictureService, _frameService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FrameUploadForm = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var FrameUploadForm = exports.FrameUploadForm = (_dec = (0, _aureliaFramework.inject)(_pictureService.PictureService, _frameService.FrameService, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function FrameUploadForm(pictureService, frameService, validationController) {
            _classCallCheck(this, FrameUploadForm);

            this.pictureService = pictureService;
            this.frameService = frameService;
            this.validationController = validationController;
            this.isWorking = false;
            this.success = false;
            this.serverError = {};
        }

        FrameUploadForm.prototype.created = function created() {
            this.validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;

            _aureliaValidation.ValidationRules.ensure("name").required().withMessage("El nombre unico no puede estar vacio.").ensure("uniqueName").required().withMessage("El nombre unico no puede estar vacio.").ensure("imageUniqueName").required().withMessage("El nombre unico de la imagen no puede estar vacio.").ensure("imageFile").required().withMessage("El archivo no puede estar vacio.").ensure("imageFormatName").required().withMessage("El nombre del formato de archivo de imagen no puede estar vacio.").on(this);
        };

        FrameUploadForm.prototype.upload = function upload() {
            var _this = this;

            this.success = false;
            this.isWorking = true;

            console.log(this.imageFiles);

            this.validationController.validate().then(function (validation) {
                if (validation.valid) {
                    _this.doUpload();
                } else {
                    _this.isWorking = false;
                }
            });
        };

        FrameUploadForm.prototype.doUpload = function doUpload() {
            var _this2 = this;

            return this.pictureService.putPicture(this.imageUniqueName, this.imageFiles[0], this.imageFormatName, null).then(function () {
                _this2.doUploadFrame();
            }, function (failure) {
                var failureMessage = JSON.parse(failure.response);
                _this2.serverError = {
                    title: failureMessage.title,
                    description: failureMessage.description
                };
            });
        };

        FrameUploadForm.prototype.doUploadFrame = function doUploadFrame() {
            var _this3 = this;

            var frame = {
                name: this.name,
                uniqueName: this.uniqueName,
                description: this.description,
                height: this.height,
                length: this.width,
                picture: {
                    imageKey: this.imageUniqueName
                },
                price: this.price
            };

            this.frameService.postFrame(frame).then(function () {
                _this3.success = true;
            }, function (failure) {
                var failureMessage = JSON.parse(failure.response);
                _this3.serverError = {
                    title: failureMessage.title,
                    description: failureMessage.description
                };
            }).then(function () {
                return _this3.isWorking = false;
            });
        };

        return FrameUploadForm;
    }()) || _class);
});
define('components/picture/canvas-test',['exports', 'aurelia-framework', '../../services/picture-service'], function (exports, _aureliaFramework, _pictureService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CanvasTest = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var CanvasTest = exports.CanvasTest = (_dec = (0, _aureliaFramework.inject)(_pictureService.PictureService), _dec(_class = function () {
        function CanvasTest(pictureService) {
            _classCallCheck(this, CanvasTest);

            this.pictureService = pictureService;
            this.rangeVal = 0;
        }

        CanvasTest.prototype.showVal = function showVal() {
            this.recolor(this.rangeVal);
        };

        CanvasTest.prototype.created = function created() {
            var _this = this;

            console.log(this.rgbToHsl(0, 0, 0));
            console.log(this.rgbToHsl(255, 255, 0));
            console.log(this.rgbToHsl(255, 255, 255));
            this.pictureService.getPicture('testPicture', false).then(function (success) {
                console.log('SUCCESS');
                console.log(success);
                var response = JSON.parse(success.response);
                _this.drawImage(response.imageUrl);
            }, function (failure) {
                console.log('FAILURE');
                console.log(failure);
            });
        };

        CanvasTest.prototype.drawImage = function drawImage(imageUrl) {
            var _this2 = this;

            this.ctx = this.canvas.getContext("2d");

            var img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                _this2.ctx.drawImage(img, 0, 0, 600, 400);
                _this2.ctx.drawImage(img, 0, 400, 600, 400);

                _this2.recolor(.33);
            };
            img.src = imageUrl;
        };

        CanvasTest.prototype.recolor = function recolor(colorshift) {
            var imgData = this.ctx.getImageData(0, 0, 600, 400);
            var data = imgData.data;

            for (var i = 0; i < data.length; i += 4) {
                var red = data[i + 0];
                var green = data[i + 1];
                var blue = data[i + 2];
                var alpha = data[i + 3];

                if (alpha < 200) {
                    continue;
                }

                var hsl = this.rgbToHsl(red, green, blue);
                var hue = hsl.h * 360;

                if (hue > 200 && hue < 300) {
                    var newRgb = this.hslToRgb(hsl.h + colorshift, hsl.s, hsl.l);
                    data[i + 0] = newRgb.r;
                    data[i + 1] = newRgb.g;
                    data[i + 2] = newRgb.b;
                    data[i + 3] = 255;
                }
            }
            this.ctx.putImageData(imgData, 400, 0);
        };

        CanvasTest.prototype.rgbToHsl = function rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h,
                s,
                l = (max + min) / 2;

            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }

            return {
                h: h,
                s: s,
                l: l
            };
        };

        CanvasTest.prototype.hslToRgb = function hslToRgb(h, s, l) {
            var r, g, b;

            if (s == 0) {
                r = g = b = l;
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        };

        return CanvasTest;
    }()) || _class);
});
define('components/picture/interact',['module', 'exports'], function (module, exports) {
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    (function (realWindow) {
        'use strict';

        if (!realWindow) {
            return;
        }

        var window = function () {
            var el = realWindow.document.createTextNode('');

            if (el.ownerDocument !== realWindow.document && typeof realWindow.wrap === 'function' && realWindow.wrap(el) === el) {
                return realWindow.wrap(realWindow);
            }

            return realWindow;
        }(),
            document = window.document,
            DocumentFragment = window.DocumentFragment || blank,
            SVGElement = window.SVGElement || blank,
            SVGSVGElement = window.SVGSVGElement || blank,
            SVGElementInstance = window.SVGElementInstance || blank,
            HTMLElement = window.HTMLElement || window.Element,
            PointerEvent = window.PointerEvent || window.MSPointerEvent,
            pEventTypes,
            hypot = Math.hypot || function (x, y) {
            return Math.sqrt(x * x + y * y);
        },
            tmpXY = {},
            documents = [],
            interactables = [],
            interactions = [],
            dynamicDrop = false,
            delegatedEvents = {},
            defaultOptions = {
            base: {
                accept: null,
                actionChecker: null,
                styleCursor: true,
                preventDefault: 'auto',
                origin: { x: 0, y: 0 },
                deltaSource: 'page',
                allowFrom: null,
                ignoreFrom: null,
                _context: document,
                dropChecker: null
            },

            drag: {
                enabled: false,
                manualStart: true,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                axis: 'xy'
            },

            drop: {
                enabled: false,
                accept: null,
                overlap: 'pointer'
            },

            resize: {
                enabled: false,
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                square: false,
                preserveAspectRatio: false,
                axis: 'xy',

                margin: NaN,

                edges: null,

                invert: 'none'
            },

            gesture: {
                manualStart: false,
                enabled: false,
                max: Infinity,
                maxPerElement: 1,

                restrict: null
            },

            perAction: {
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: {
                    enabled: false,
                    endOnly: false,
                    range: Infinity,
                    targets: null,
                    offsets: null,

                    relativePoints: null
                },

                restrict: {
                    enabled: false,
                    endOnly: false
                },

                autoScroll: {
                    enabled: false,
                    container: null,
                    margin: 60,
                    speed: 300 },

                inertia: {
                    enabled: false,
                    resistance: 10,
                    minSpeed: 100,
                    endSpeed: 10,
                    allowResume: true,
                    zeroResumeDelta: true,
                    smoothEndDuration: 300 }
            },

            _holdDuration: 600
        },
            autoScroll = {
            interaction: null,
            i: null,
            x: 0, y: 0,
            scroll: function scroll() {
                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
                    container = options.container || getWindow(autoScroll.interaction.element),
                    now = new Date().getTime(),
                    dtx = (now - autoScroll.prevTimeX) / 1000,
                    dty = (now - autoScroll.prevTimeY) / 1000,
                    vx,
                    vy,
                    sx,
                    sy;

                if (options.velocity) {
                    vx = options.velocity.x;
                    vy = options.velocity.y;
                } else {
                    vx = vy = options.speed;
                }

                sx = vx * dtx;
                sy = vy * dty;

                if (sx >= 1 || sy >= 1) {
                    if (isWindow(container)) {
                        container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
                    } else if (container) {
                        container.scrollLeft += autoScroll.x * sx;
                        container.scrollTop += autoScroll.y * sy;
                    }

                    if (sx >= 1) autoScroll.prevTimeX = now;
                    if (sy >= 1) autoScroll.prevTimeY = now;
                }

                if (autoScroll.isScrolling) {
                    cancelFrame(autoScroll.i);
                    autoScroll.i = reqFrame(autoScroll.scroll);
                }
            },

            isScrolling: false,
            prevTimeX: 0,
            prevTimeY: 0,

            start: function start(interaction) {
                autoScroll.isScrolling = true;
                cancelFrame(autoScroll.i);

                autoScroll.interaction = interaction;
                autoScroll.prevTimeX = new Date().getTime();
                autoScroll.prevTimeY = new Date().getTime();
                autoScroll.i = reqFrame(autoScroll.scroll);
            },

            stop: function stop() {
                autoScroll.isScrolling = false;
                cancelFrame(autoScroll.i);
            }
        },
            supportsTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch,
            supportsPointerEvent = !!PointerEvent,
            margin = supportsTouch || supportsPointerEvent ? 20 : 10,
            pointerMoveTolerance = 1,
            prevTouchTime = 0,
            maxInteractions = Infinity,
            actionCursors = document.all && !window.atob ? {
            drag: 'move',
            resizex: 'e-resize',
            resizey: 's-resize',
            resizexy: 'se-resize',

            resizetop: 'n-resize',
            resizeleft: 'w-resize',
            resizebottom: 's-resize',
            resizeright: 'e-resize',
            resizetopleft: 'se-resize',
            resizebottomright: 'se-resize',
            resizetopright: 'ne-resize',
            resizebottomleft: 'ne-resize',

            gesture: ''
        } : {
            drag: 'move',
            resizex: 'ew-resize',
            resizey: 'ns-resize',
            resizexy: 'nwse-resize',

            resizetop: 'ns-resize',
            resizeleft: 'ew-resize',
            resizebottom: 'ns-resize',
            resizeright: 'ew-resize',
            resizetopleft: 'nwse-resize',
            resizebottomright: 'nwse-resize',
            resizetopright: 'nesw-resize',
            resizebottomleft: 'nesw-resize',

            gesture: ''
        },
            actionIsEnabled = {
            drag: true,
            resize: true,
            gesture: true
        },
            wheelEvent = 'onmousewheel' in document ? 'mousewheel' : 'wheel',
            eventTypes = ['dragstart', 'dragmove', 'draginertiastart', 'dragend', 'dragenter', 'dragleave', 'dropactivate', 'dropdeactivate', 'dropmove', 'drop', 'resizestart', 'resizemove', 'resizeinertiastart', 'resizeend', 'gesturestart', 'gesturemove', 'gestureinertiastart', 'gestureend', 'down', 'move', 'up', 'cancel', 'tap', 'doubletap', 'hold'],
            globalEvents = {},
            isOperaMobile = navigator.appName == 'Opera' && supportsTouch && navigator.userAgent.match('Presto'),
            isIOS7 = /iP(hone|od|ad)/.test(navigator.platform) && /OS 7[^\d]/.test(navigator.appVersion),
            prefixedMatchesSelector = 'matches' in Element.prototype ? 'matches' : 'webkitMatchesSelector' in Element.prototype ? 'webkitMatchesSelector' : 'mozMatchesSelector' in Element.prototype ? 'mozMatchesSelector' : 'oMatchesSelector' in Element.prototype ? 'oMatchesSelector' : 'msMatchesSelector',
            ie8MatchesSelector,
            reqFrame = realWindow.requestAnimationFrame,
            cancelFrame = realWindow.cancelAnimationFrame,
            events = function () {
            var useAttachEvent = 'attachEvent' in window && !('addEventListener' in window),
                addEvent = useAttachEvent ? 'attachEvent' : 'addEventListener',
                removeEvent = useAttachEvent ? 'detachEvent' : 'removeEventListener',
                on = useAttachEvent ? 'on' : '',
                elements = [],
                targets = [],
                attachedListeners = [];

            function add(element, type, listener, useCapture) {
                var elementIndex = indexOf(elements, element),
                    target = targets[elementIndex];

                if (!target) {
                    target = {
                        events: {},
                        typeCount: 0
                    };

                    elementIndex = elements.push(element) - 1;
                    targets.push(target);

                    attachedListeners.push(useAttachEvent ? {
                        supplied: [],
                        wrapped: [],
                        useCount: []
                    } : null);
                }

                if (!target.events[type]) {
                    target.events[type] = [];
                    target.typeCount++;
                }

                if (!contains(target.events[type], listener)) {
                    var ret;

                    if (useAttachEvent) {
                        var listeners = attachedListeners[elementIndex],
                            listenerIndex = indexOf(listeners.supplied, listener);

                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
                            if (!event.immediatePropagationStopped) {
                                event.target = event.srcElement;
                                event.currentTarget = element;

                                event.preventDefault = event.preventDefault || preventDef;
                                event.stopPropagation = event.stopPropagation || stopProp;
                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

                                if (/mouse|click/.test(event.type)) {
                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
                                }

                                listener(event);
                            }
                        };

                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

                        if (listenerIndex === -1) {
                            listeners.supplied.push(listener);
                            listeners.wrapped.push(wrapped);
                            listeners.useCount.push(1);
                        } else {
                            listeners.useCount[listenerIndex]++;
                        }
                    } else {
                        ret = element[addEvent](type, listener, useCapture || false);
                    }
                    target.events[type].push(listener);

                    return ret;
                }
            }

            function remove(element, type, listener, useCapture) {
                var i,
                    elementIndex = indexOf(elements, element),
                    target = targets[elementIndex],
                    listeners,
                    listenerIndex,
                    wrapped = listener;

                if (!target || !target.events) {
                    return;
                }

                if (useAttachEvent) {
                    listeners = attachedListeners[elementIndex];
                    listenerIndex = indexOf(listeners.supplied, listener);
                    wrapped = listeners.wrapped[listenerIndex];
                }

                if (type === 'all') {
                    for (type in target.events) {
                        if (target.events.hasOwnProperty(type)) {
                            remove(element, type, 'all');
                        }
                    }
                    return;
                }

                if (target.events[type]) {
                    var len = target.events[type].length;

                    if (listener === 'all') {
                        for (i = 0; i < len; i++) {
                            remove(element, type, target.events[type][i], Boolean(useCapture));
                        }
                        return;
                    } else {
                        for (i = 0; i < len; i++) {
                            if (target.events[type][i] === listener) {
                                element[removeEvent](on + type, wrapped, useCapture || false);
                                target.events[type].splice(i, 1);

                                if (useAttachEvent && listeners) {
                                    listeners.useCount[listenerIndex]--;
                                    if (listeners.useCount[listenerIndex] === 0) {
                                        listeners.supplied.splice(listenerIndex, 1);
                                        listeners.wrapped.splice(listenerIndex, 1);
                                        listeners.useCount.splice(listenerIndex, 1);
                                    }
                                }

                                break;
                            }
                        }
                    }

                    if (target.events[type] && target.events[type].length === 0) {
                        target.events[type] = null;
                        target.typeCount--;
                    }
                }

                if (!target.typeCount) {
                    targets.splice(elementIndex, 1);
                    elements.splice(elementIndex, 1);
                    attachedListeners.splice(elementIndex, 1);
                }
            }

            function preventDef() {
                this.returnValue = false;
            }

            function stopProp() {
                this.cancelBubble = true;
            }

            function stopImmProp() {
                this.cancelBubble = true;
                this.immediatePropagationStopped = true;
            }

            return {
                add: add,
                remove: remove,
                useAttachEvent: useAttachEvent,

                _elements: elements,
                _targets: targets,
                _attachedListeners: attachedListeners
            };
        }();

        function blank() {}

        function isElement(o) {
            if (!o || (typeof o === 'undefined' ? 'undefined' : _typeof(o)) !== 'object') {
                return false;
            }

            var _window = getWindow(o) || window;

            return (/object|function/.test(_typeof(_window.Element)) ? o instanceof _window.Element : o.nodeType === 1 && typeof o.nodeName === "string"
            );
        }
        function isWindow(thing) {
            return thing === window || !!(thing && thing.Window) && thing instanceof thing.Window;
        }
        function isDocFrag(thing) {
            return !!thing && thing instanceof DocumentFragment;
        }
        function isArray(thing) {
            return isObject(thing) && _typeof(thing.length) !== undefined && isFunction(thing.splice);
        }
        function isObject(thing) {
            return !!thing && (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object';
        }
        function isFunction(thing) {
            return typeof thing === 'function';
        }
        function isNumber(thing) {
            return typeof thing === 'number';
        }
        function isBool(thing) {
            return typeof thing === 'boolean';
        }
        function isString(thing) {
            return typeof thing === 'string';
        }

        function trySelector(value) {
            if (!isString(value)) {
                return false;
            }

            document.querySelector(value);
            return true;
        }

        function extend(dest, source) {
            for (var prop in source) {
                dest[prop] = source[prop];
            }
            return dest;
        }

        var prefixedPropREs = {
            webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
        };

        function pointerExtend(dest, source) {
            for (var prop in source) {
                var deprecated = false;

                for (var vendor in prefixedPropREs) {
                    if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
                        deprecated = true;
                        break;
                    }
                }

                if (!deprecated) {
                    dest[prop] = source[prop];
                }
            }
            return dest;
        }

        function copyCoords(dest, src) {
            dest.page = dest.page || {};
            dest.page.x = src.page.x;
            dest.page.y = src.page.y;

            dest.client = dest.client || {};
            dest.client.x = src.client.x;
            dest.client.y = src.client.y;

            dest.timeStamp = src.timeStamp;
        }

        function _setEventXY(targetObj, pointers, interaction) {
            var pointer = pointers.length > 1 ? pointerAverage(pointers) : pointers[0];

            _getPageXY(pointer, tmpXY, interaction);
            targetObj.page.x = tmpXY.x;
            targetObj.page.y = tmpXY.y;

            _getClientXY(pointer, tmpXY, interaction);
            targetObj.client.x = tmpXY.x;
            targetObj.client.y = tmpXY.y;

            targetObj.timeStamp = new Date().getTime();
        }

        function setEventDeltas(targetObj, prev, cur) {
            targetObj.page.x = cur.page.x - prev.page.x;
            targetObj.page.y = cur.page.y - prev.page.y;
            targetObj.client.x = cur.client.x - prev.client.x;
            targetObj.client.y = cur.client.y - prev.client.y;
            targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

            var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
            targetObj.page.speed = hypot(targetObj.page.x, targetObj.page.y) / dt;
            targetObj.page.vx = targetObj.page.x / dt;
            targetObj.page.vy = targetObj.page.y / dt;

            targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
            targetObj.client.vx = targetObj.client.x / dt;
            targetObj.client.vy = targetObj.client.y / dt;
        }

        function isNativePointer(pointer) {
            return pointer instanceof window.Event || supportsTouch && window.Touch && pointer instanceof window.Touch;
        }

        function getXY(type, pointer, xy) {
            xy = xy || {};
            type = type || 'page';

            xy.x = pointer[type + 'X'];
            xy.y = pointer[type + 'Y'];

            return xy;
        }

        function _getPageXY(pointer, page) {
            page = page || {};

            if (isOperaMobile && isNativePointer(pointer)) {
                getXY('screen', pointer, page);

                page.x += window.scrollX;
                page.y += window.scrollY;
            } else {
                getXY('page', pointer, page);
            }

            return page;
        }

        function _getClientXY(pointer, client) {
            client = client || {};

            if (isOperaMobile && isNativePointer(pointer)) {
                getXY('screen', pointer, client);
            } else {
                getXY('client', pointer, client);
            }

            return client;
        }

        function getScrollXY(win) {
            win = win || window;
            return {
                x: win.scrollX || win.document.documentElement.scrollLeft,
                y: win.scrollY || win.document.documentElement.scrollTop
            };
        }

        function getPointerId(pointer) {
            return isNumber(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
        }

        function getActualElement(element) {
            return element instanceof SVGElementInstance ? element.correspondingUseElement : element;
        }

        function getWindow(node) {
            if (isWindow(node)) {
                return node;
            }

            var rootNode = node.ownerDocument || node;

            return rootNode.defaultView || rootNode.parentWindow || window;
        }

        function getElementClientRect(element) {
            var clientRect = element instanceof SVGElement ? element.getBoundingClientRect() : element.getClientRects()[0];

            return clientRect && {
                left: clientRect.left,
                right: clientRect.right,
                top: clientRect.top,
                bottom: clientRect.bottom,
                width: clientRect.width || clientRect.right - clientRect.left,
                height: clientRect.height || clientRect.bottom - clientRect.top
            };
        }

        function getElementRect(element) {
            var clientRect = getElementClientRect(element);

            if (!isIOS7 && clientRect) {
                var scroll = getScrollXY(getWindow(element));

                clientRect.left += scroll.x;
                clientRect.right += scroll.x;
                clientRect.top += scroll.y;
                clientRect.bottom += scroll.y;
            }

            return clientRect;
        }

        function getTouchPair(event) {
            var touches = [];

            if (isArray(event)) {
                touches[0] = event[0];
                touches[1] = event[1];
            } else {
                    if (event.type === 'touchend') {
                        if (event.touches.length === 1) {
                            touches[0] = event.touches[0];
                            touches[1] = event.changedTouches[0];
                        } else if (event.touches.length === 0) {
                            touches[0] = event.changedTouches[0];
                            touches[1] = event.changedTouches[1];
                        }
                    } else {
                        touches[0] = event.touches[0];
                        touches[1] = event.touches[1];
                    }
                }

            return touches;
        }

        function pointerAverage(pointers) {
            var average = {
                pageX: 0,
                pageY: 0,
                clientX: 0,
                clientY: 0,
                screenX: 0,
                screenY: 0
            };
            var prop;

            for (var i = 0; i < pointers.length; i++) {
                for (prop in average) {
                    average[prop] += pointers[i][prop];
                }
            }
            for (prop in average) {
                average[prop] /= pointers.length;
            }

            return average;
        }

        function touchBBox(event) {
            if (!event.length && !(event.touches && event.touches.length > 1)) {
                return;
            }

            var touches = getTouchPair(event),
                minX = Math.min(touches[0].pageX, touches[1].pageX),
                minY = Math.min(touches[0].pageY, touches[1].pageY),
                maxX = Math.max(touches[0].pageX, touches[1].pageX),
                maxY = Math.max(touches[0].pageY, touches[1].pageY);

            return {
                x: minX,
                y: minY,
                left: minX,
                top: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }

        function touchDistance(event, deltaSource) {
            deltaSource = deltaSource || defaultOptions.deltaSource;

            var sourceX = deltaSource + 'X',
                sourceY = deltaSource + 'Y',
                touches = getTouchPair(event);

            var dx = touches[0][sourceX] - touches[1][sourceX],
                dy = touches[0][sourceY] - touches[1][sourceY];

            return hypot(dx, dy);
        }

        function touchAngle(event, prevAngle, deltaSource) {
            deltaSource = deltaSource || defaultOptions.deltaSource;

            var sourceX = deltaSource + 'X',
                sourceY = deltaSource + 'Y',
                touches = getTouchPair(event),
                dx = touches[0][sourceX] - touches[1][sourceX],
                dy = touches[0][sourceY] - touches[1][sourceY],
                angle = 180 * Math.atan(dy / dx) / Math.PI;

            if (isNumber(prevAngle)) {
                var dr = angle - prevAngle,
                    drClamped = dr % 360;

                if (drClamped > 315) {
                    angle -= 360 + angle / 360 | 0 * 360;
                } else if (drClamped > 135) {
                    angle -= 180 + angle / 360 | 0 * 360;
                } else if (drClamped < -315) {
                    angle += 360 + angle / 360 | 0 * 360;
                } else if (drClamped < -135) {
                    angle += 180 + angle / 360 | 0 * 360;
                }
            }

            return angle;
        }

        function getOriginXY(interactable, element) {
            var origin = interactable ? interactable.options.origin : defaultOptions.origin;

            if (origin === 'parent') {
                origin = parentElement(element);
            } else if (origin === 'self') {
                origin = interactable.getRect(element);
            } else if (trySelector(origin)) {
                origin = closest(element, origin) || { x: 0, y: 0 };
            }

            if (isFunction(origin)) {
                origin = origin(interactable && element);
            }

            if (isElement(origin)) {
                origin = getElementRect(origin);
            }

            origin.x = 'x' in origin ? origin.x : origin.left;
            origin.y = 'y' in origin ? origin.y : origin.top;

            return origin;
        }

        function _getQBezierValue(t, p1, p2, p3) {
            var iT = 1 - t;
            return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
        }

        function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
            return {
                x: _getQBezierValue(position, startX, cpX, endX),
                y: _getQBezierValue(position, startY, cpY, endY)
            };
        }

        function easeOutQuad(t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }

        function nodeContains(parent, child) {
            while (child) {
                if (child === parent) {
                    return true;
                }

                child = child.parentNode;
            }

            return false;
        }

        function closest(child, selector) {
            var parent = parentElement(child);

            while (isElement(parent)) {
                if (matchesSelector(parent, selector)) {
                    return parent;
                }

                parent = parentElement(parent);
            }

            return null;
        }

        function parentElement(node) {
            var parent = node.parentNode;

            if (isDocFrag(parent)) {
                while ((parent = parent.host) && isDocFrag(parent)) {}

                return parent;
            }

            return parent;
        }

        function inContext(interactable, element) {
            return interactable._context === element.ownerDocument || nodeContains(interactable._context, element);
        }

        function testIgnore(interactable, interactableElement, element) {
            var ignoreFrom = interactable.options.ignoreFrom;

            if (!ignoreFrom || !isElement(element)) {
                return false;
            }

            if (isString(ignoreFrom)) {
                return matchesUpTo(element, ignoreFrom, interactableElement);
            } else if (isElement(ignoreFrom)) {
                return nodeContains(ignoreFrom, element);
            }

            return false;
        }

        function testAllow(interactable, interactableElement, element) {
            var allowFrom = interactable.options.allowFrom;

            if (!allowFrom) {
                return true;
            }

            if (!isElement(element)) {
                return false;
            }

            if (isString(allowFrom)) {
                return matchesUpTo(element, allowFrom, interactableElement);
            } else if (isElement(allowFrom)) {
                return nodeContains(allowFrom, element);
            }

            return false;
        }

        function checkAxis(axis, interactable) {
            if (!interactable) {
                return false;
            }

            var thisAxis = interactable.options.drag.axis;

            return axis === 'xy' || thisAxis === 'xy' || thisAxis === axis;
        }

        function checkSnap(interactable, action) {
            var options = interactable.options;

            if (/^resize/.test(action)) {
                action = 'resize';
            }

            return options[action].snap && options[action].snap.enabled;
        }

        function checkRestrict(interactable, action) {
            var options = interactable.options;

            if (/^resize/.test(action)) {
                action = 'resize';
            }

            return options[action].restrict && options[action].restrict.enabled;
        }

        function checkAutoScroll(interactable, action) {
            var options = interactable.options;

            if (/^resize/.test(action)) {
                action = 'resize';
            }

            return options[action].autoScroll && options[action].autoScroll.enabled;
        }

        function withinInteractionLimit(interactable, element, action) {
            var options = interactable.options,
                maxActions = options[action.name].max,
                maxPerElement = options[action.name].maxPerElement,
                activeInteractions = 0,
                targetCount = 0,
                targetElementCount = 0;

            for (var i = 0, len = interactions.length; i < len; i++) {
                var interaction = interactions[i],
                    otherAction = interaction.prepared.name,
                    active = interaction.interacting();

                if (!active) {
                    continue;
                }

                activeInteractions++;

                if (activeInteractions >= maxInteractions) {
                    return false;
                }

                if (interaction.target !== interactable) {
                    continue;
                }

                targetCount += otherAction === action.name | 0;

                if (targetCount >= maxActions) {
                    return false;
                }

                if (interaction.element === element) {
                    targetElementCount++;

                    if (otherAction !== action.name || targetElementCount >= maxPerElement) {
                        return false;
                    }
                }
            }

            return maxInteractions > 0;
        }

        function indexOfDeepestElement(elements) {
            var dropzone,
                deepestZone = elements[0],
                index = deepestZone ? 0 : -1,
                parent,
                deepestZoneParents = [],
                dropzoneParents = [],
                child,
                i,
                n;

            for (i = 1; i < elements.length; i++) {
                dropzone = elements[i];

                if (!dropzone || dropzone === deepestZone) {
                    continue;
                }

                if (!deepestZone) {
                    deepestZone = dropzone;
                    index = i;
                    continue;
                }

                if (dropzone.parentNode === dropzone.ownerDocument) {
                    continue;
                } else if (deepestZone.parentNode === dropzone.ownerDocument) {
                        deepestZone = dropzone;
                        index = i;
                        continue;
                    }

                if (!deepestZoneParents.length) {
                    parent = deepestZone;
                    while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
                        deepestZoneParents.unshift(parent);
                        parent = parent.parentNode;
                    }
                }

                if (deepestZone instanceof HTMLElement && dropzone instanceof SVGElement && !(dropzone instanceof SVGSVGElement)) {

                    if (dropzone === deepestZone.parentNode) {
                        continue;
                    }

                    parent = dropzone.ownerSVGElement;
                } else {
                    parent = dropzone;
                }

                dropzoneParents = [];

                while (parent.parentNode !== parent.ownerDocument) {
                    dropzoneParents.unshift(parent);
                    parent = parent.parentNode;
                }

                n = 0;

                while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
                    n++;
                }

                var parents = [dropzoneParents[n - 1], dropzoneParents[n], deepestZoneParents[n]];

                child = parents[0].lastChild;

                while (child) {
                    if (child === parents[1]) {
                        deepestZone = dropzone;
                        index = i;
                        deepestZoneParents = [];

                        break;
                    } else if (child === parents[2]) {
                        break;
                    }

                    child = child.previousSibling;
                }
            }

            return index;
        }

        function Interaction() {
            this.target = null;
            this.element = null;
            this.dropTarget = null;
            this.dropElement = null;
            this.prevDropTarget = null;
            this.prevDropElement = null;

            this.prepared = {
                name: null,
                axis: null,
                edges: null
            };

            this.matches = [];
            this.matchElements = [];

            this.inertiaStatus = {
                active: false,
                smoothEnd: false,
                ending: false,

                startEvent: null,
                upCoords: {},

                xe: 0, ye: 0,
                sx: 0, sy: 0,

                t0: 0,
                vx0: 0, vys: 0,
                duration: 0,

                resumeDx: 0,
                resumeDy: 0,

                lambda_v0: 0,
                one_ve_v0: 0,
                i: null
            };

            if (isFunction(Function.prototype.bind)) {
                this.boundInertiaFrame = this.inertiaFrame.bind(this);
                this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
            } else {
                var that = this;

                this.boundInertiaFrame = function () {
                    return that.inertiaFrame();
                };
                this.boundSmoothEndFrame = function () {
                    return that.smoothEndFrame();
                };
            }

            this.activeDrops = {
                dropzones: [],
                elements: [],
                rects: [] };

            this.pointers = [];
            this.pointerIds = [];
            this.downTargets = [];
            this.downTimes = [];
            this.holdTimers = [];

            this.prevCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0
            };

            this.curCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0
            };

            this.startCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0
            };

            this.pointerDelta = {
                page: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
                client: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
                timeStamp: 0
            };

            this.downEvent = null;
            this.downPointer = {};

            this._eventTarget = null;
            this._curEventTarget = null;

            this.prevEvent = null;
            this.tapTime = 0;
            this.prevTap = null;

            this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 };
            this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
            this.snapOffsets = [];

            this.gesture = {
                start: { x: 0, y: 0 },

                startDistance: 0,
                prevDistance: 0,
                distance: 0,

                scale: 1,

                startAngle: 0,
                prevAngle: 0 };

            this.snapStatus = {
                x: 0, y: 0,
                dx: 0, dy: 0,
                realX: 0, realY: 0,
                snappedX: 0, snappedY: 0,
                targets: [],
                locked: false,
                changed: false
            };

            this.restrictStatus = {
                dx: 0, dy: 0,
                restrictedX: 0, restrictedY: 0,
                snap: null,
                restricted: false,
                changed: false
            };

            this.restrictStatus.snap = this.snapStatus;

            this.pointerIsDown = false;
            this.pointerWasMoved = false;
            this.gesturing = false;
            this.dragging = false;
            this.resizing = false;
            this.resizeAxes = 'xy';

            this.mouse = false;

            interactions.push(this);
        }

        Interaction.prototype = {
            getPageXY: function getPageXY(pointer, xy) {
                return _getPageXY(pointer, xy, this);
            },
            getClientXY: function getClientXY(pointer, xy) {
                return _getClientXY(pointer, xy, this);
            },
            setEventXY: function setEventXY(target, ptr) {
                return _setEventXY(target, ptr, this);
            },

            pointerOver: function pointerOver(pointer, event, eventTarget) {
                if (this.prepared.name || !this.mouse) {
                    return;
                }

                var curMatches = [],
                    curMatchElements = [],
                    prevTargetElement = this.element;

                this.addPointer(pointer);

                if (this.target && (testIgnore(this.target, this.element, eventTarget) || !testAllow(this.target, this.element, eventTarget))) {
                    this.target = null;
                    this.element = null;
                    this.matches = [];
                    this.matchElements = [];
                }

                var elementInteractable = interactables.get(eventTarget),
                    elementAction = elementInteractable && !testIgnore(elementInteractable, eventTarget, eventTarget) && testAllow(elementInteractable, eventTarget, eventTarget) && validateAction(elementInteractable.getAction(pointer, event, this, eventTarget), elementInteractable);

                if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
                    elementAction = null;
                }

                function pushCurMatches(interactable, selector) {
                    if (interactable && inContext(interactable, eventTarget) && !testIgnore(interactable, eventTarget, eventTarget) && testAllow(interactable, eventTarget, eventTarget) && matchesSelector(eventTarget, selector)) {

                        curMatches.push(interactable);
                        curMatchElements.push(eventTarget);
                    }
                }

                if (elementAction) {
                    this.target = elementInteractable;
                    this.element = eventTarget;
                    this.matches = [];
                    this.matchElements = [];
                } else {
                    interactables.forEachSelector(pushCurMatches);

                    if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
                        this.matches = curMatches;
                        this.matchElements = curMatchElements;

                        this.pointerHover(pointer, event, this.matches, this.matchElements);
                        events.add(eventTarget, PointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
                    } else if (this.target) {
                        if (nodeContains(prevTargetElement, eventTarget)) {
                            this.pointerHover(pointer, event, this.matches, this.matchElements);
                            events.add(this.element, PointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
                        } else {
                            this.target = null;
                            this.element = null;
                            this.matches = [];
                            this.matchElements = [];
                        }
                    }
                }
            },

            pointerHover: function pointerHover(pointer, event, eventTarget, curEventTarget, matches, matchElements) {
                var target = this.target;

                if (!this.prepared.name && this.mouse) {

                    var action;

                    this.setEventXY(this.curCoords, [pointer]);

                    if (matches) {
                        action = this.validateSelector(pointer, event, matches, matchElements);
                    } else if (target) {
                        action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
                    }

                    if (target && target.options.styleCursor) {
                        if (action) {
                            target._doc.documentElement.style.cursor = getActionCursor(action);
                        } else {
                            target._doc.documentElement.style.cursor = '';
                        }
                    }
                } else if (this.prepared.name) {
                    this.checkAndPreventDefault(event, target, this.element);
                }
            },

            pointerOut: function pointerOut(pointer, event, eventTarget) {
                if (this.prepared.name) {
                    return;
                }

                if (!interactables.get(eventTarget)) {
                    events.remove(eventTarget, PointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
                }

                if (this.target && this.target.options.styleCursor && !this.interacting()) {
                    this.target._doc.documentElement.style.cursor = '';
                }
            },

            selectorDown: function selectorDown(pointer, event, eventTarget, curEventTarget) {
                var that = this,
                    eventCopy = events.useAttachEvent ? extend({}, event) : event,
                    element = eventTarget,
                    pointerIndex = this.addPointer(pointer),
                    action;

                this.holdTimers[pointerIndex] = setTimeout(function () {
                    that.pointerHold(events.useAttachEvent ? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
                }, defaultOptions._holdDuration);

                this.pointerIsDown = true;

                if (this.inertiaStatus.active && this.target.selector) {
                    while (isElement(element)) {
                        if (element === this.element && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {
                            cancelFrame(this.inertiaStatus.i);
                            this.inertiaStatus.active = false;

                            this.collectEventTargets(pointer, event, eventTarget, 'down');
                            return;
                        }
                        element = parentElement(element);
                    }
                }

                if (this.interacting()) {
                    this.collectEventTargets(pointer, event, eventTarget, 'down');
                    return;
                }

                function pushMatches(interactable, selector, context) {
                    var elements = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;

                    if (inContext(interactable, element) && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, elements)) {

                        that.matches.push(interactable);
                        that.matchElements.push(element);
                    }
                }

                this.setEventXY(this.curCoords, [pointer]);
                this.downEvent = event;

                while (isElement(element) && !action) {
                    this.matches = [];
                    this.matchElements = [];

                    interactables.forEachSelector(pushMatches);

                    action = this.validateSelector(pointer, event, this.matches, this.matchElements);
                    element = parentElement(element);
                }

                if (action) {
                    this.prepared.name = action.name;
                    this.prepared.axis = action.axis;
                    this.prepared.edges = action.edges;

                    this.collectEventTargets(pointer, event, eventTarget, 'down');

                    return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
                } else {
                    this.downTimes[pointerIndex] = new Date().getTime();
                    this.downTargets[pointerIndex] = eventTarget;
                    pointerExtend(this.downPointer, pointer);

                    copyCoords(this.prevCoords, this.curCoords);
                    this.pointerWasMoved = false;
                }

                this.collectEventTargets(pointer, event, eventTarget, 'down');
            },

            pointerDown: function pointerDown(pointer, event, eventTarget, curEventTarget, forceAction) {
                if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
                    this.checkAndPreventDefault(event, this.target, this.element);

                    return;
                }

                this.pointerIsDown = true;
                this.downEvent = event;

                var pointerIndex = this.addPointer(pointer),
                    action;

                if (this.pointerIds.length > 1 && this.target._element === this.element) {
                    var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);

                    if (withinInteractionLimit(this.target, this.element, newAction)) {
                        action = newAction;
                    }

                    this.prepared.name = null;
                } else if (!this.prepared.name) {
                        var interactable = interactables.get(curEventTarget);

                        if (interactable && !testIgnore(interactable, curEventTarget, eventTarget) && testAllow(interactable, curEventTarget, eventTarget) && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget)) && withinInteractionLimit(interactable, curEventTarget, action)) {
                            this.target = interactable;
                            this.element = curEventTarget;
                        }
                    }

                var target = this.target,
                    options = target && target.options;

                if (target && (forceAction || !this.prepared.name)) {
                    action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);

                    this.setEventXY(this.startCoords, this.pointers);

                    if (!action) {
                        return;
                    }

                    if (options.styleCursor) {
                        target._doc.documentElement.style.cursor = getActionCursor(action);
                    }

                    this.resizeAxes = action.name === 'resize' ? action.axis : null;

                    if (action === 'gesture' && this.pointerIds.length < 2) {
                        action = null;
                    }

                    this.prepared.name = action.name;
                    this.prepared.axis = action.axis;
                    this.prepared.edges = action.edges;

                    this.snapStatus.snappedX = this.snapStatus.snappedY = this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

                    this.downTimes[pointerIndex] = new Date().getTime();
                    this.downTargets[pointerIndex] = eventTarget;
                    pointerExtend(this.downPointer, pointer);

                    copyCoords(this.prevCoords, this.startCoords);
                    this.pointerWasMoved = false;

                    this.checkAndPreventDefault(event, target, this.element);
                } else if (this.inertiaStatus.active && curEventTarget === this.element && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {

                        cancelFrame(this.inertiaStatus.i);
                        this.inertiaStatus.active = false;

                        this.checkAndPreventDefault(event, target, this.element);
                    }
            },

            setModifications: function setModifications(coords, preEnd) {
                var target = this.target,
                    shouldMove = true,
                    shouldSnap = checkSnap(target, this.prepared.name) && (!target.options[this.prepared.name].snap.endOnly || preEnd),
                    shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

                if (shouldSnap) {
                    this.setSnapping(coords);
                } else {
                    this.snapStatus.locked = false;
                }
                if (shouldRestrict) {
                    this.setRestriction(coords);
                } else {
                    this.restrictStatus.restricted = false;
                }

                if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
                    shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
                } else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
                    shouldMove = false;
                }

                return shouldMove;
            },

            setStartOffsets: function setStartOffsets(action, interactable, element) {
                var rect = interactable.getRect(element),
                    origin = getOriginXY(interactable, element),
                    snap = interactable.options[this.prepared.name].snap,
                    restrict = interactable.options[this.prepared.name].restrict,
                    width,
                    height;

                if (rect) {
                    this.startOffset.left = this.startCoords.page.x - rect.left;
                    this.startOffset.top = this.startCoords.page.y - rect.top;

                    this.startOffset.right = rect.right - this.startCoords.page.x;
                    this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

                    if ('width' in rect) {
                        width = rect.width;
                    } else {
                        width = rect.right - rect.left;
                    }
                    if ('height' in rect) {
                        height = rect.height;
                    } else {
                        height = rect.bottom - rect.top;
                    }
                } else {
                    this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
                }

                this.snapOffsets.splice(0);

                var snapOffset = snap && snap.offset === 'startCoords' ? {
                    x: this.startCoords.page.x - origin.x,
                    y: this.startCoords.page.y - origin.y
                } : snap && snap.offset || { x: 0, y: 0 };

                if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
                    for (var i = 0; i < snap.relativePoints.length; i++) {
                        this.snapOffsets.push({
                            x: this.startOffset.left - width * snap.relativePoints[i].x + snapOffset.x,
                            y: this.startOffset.top - height * snap.relativePoints[i].y + snapOffset.y
                        });
                    }
                } else {
                    this.snapOffsets.push(snapOffset);
                }

                if (rect && restrict.elementRect) {
                    this.restrictOffset.left = this.startOffset.left - width * restrict.elementRect.left;
                    this.restrictOffset.top = this.startOffset.top - height * restrict.elementRect.top;

                    this.restrictOffset.right = this.startOffset.right - width * (1 - restrict.elementRect.right);
                    this.restrictOffset.bottom = this.startOffset.bottom - height * (1 - restrict.elementRect.bottom);
                } else {
                    this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
                }
            },

            start: function start(action, interactable, element) {
                if (this.interacting() || !this.pointerIsDown || this.pointerIds.length < (action.name === 'gesture' ? 2 : 1)) {
                    return;
                }

                if (indexOf(interactions, this) === -1) {
                    interactions.push(this);
                }

                if (!this.prepared.name) {
                    this.setEventXY(this.startCoords);
                }

                this.prepared.name = action.name;
                this.prepared.axis = action.axis;
                this.prepared.edges = action.edges;
                this.target = interactable;
                this.element = element;

                this.setStartOffsets(action.name, interactable, element);
                this.setModifications(this.startCoords.page);

                this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
            },

            pointerMove: function pointerMove(pointer, event, eventTarget, curEventTarget, preEnd) {
                if (this.inertiaStatus.active) {
                    var pageUp = this.inertiaStatus.upCoords.page;
                    var clientUp = this.inertiaStatus.upCoords.client;

                    var inertiaPosition = {
                        pageX: pageUp.x + this.inertiaStatus.sx,
                        pageY: pageUp.y + this.inertiaStatus.sy,
                        clientX: clientUp.x + this.inertiaStatus.sx,
                        clientY: clientUp.y + this.inertiaStatus.sy
                    };

                    this.setEventXY(this.curCoords, [inertiaPosition]);
                } else {
                    this.recordPointer(pointer);
                    this.setEventXY(this.curCoords, this.pointers);
                }

                var duplicateMove = this.curCoords.page.x === this.prevCoords.page.x && this.curCoords.page.y === this.prevCoords.page.y && this.curCoords.client.x === this.prevCoords.client.x && this.curCoords.client.y === this.prevCoords.client.y;

                var dx,
                    dy,
                    pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));

                if (this.pointerIsDown && !this.pointerWasMoved) {
                    dx = this.curCoords.client.x - this.startCoords.client.x;
                    dy = this.curCoords.client.y - this.startCoords.client.y;

                    this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
                }

                if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
                    if (this.pointerIsDown) {
                        clearTimeout(this.holdTimers[pointerIndex]);
                    }

                    this.collectEventTargets(pointer, event, eventTarget, 'move');
                }

                if (!this.pointerIsDown) {
                    return;
                }

                if (duplicateMove && this.pointerWasMoved && !preEnd) {
                    this.checkAndPreventDefault(event, this.target, this.element);
                    return;
                }

                setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

                if (!this.prepared.name) {
                    return;
                }

                if (this.pointerWasMoved && (!this.inertiaStatus.active || pointer instanceof InteractEvent && /inertiastart/.test(pointer.type))) {
                    if (!this.interacting()) {
                        setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

                        if (this.prepared.name === 'drag') {
                            var absX = Math.abs(dx),
                                absY = Math.abs(dy),
                                targetAxis = this.target.options.drag.axis,
                                axis = absX > absY ? 'x' : absX < absY ? 'y' : 'xy';

                            if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
                                this.prepared.name = null;

                                var element = eventTarget;

                                while (isElement(element)) {
                                    var elementInteractable = interactables.get(element);

                                    if (elementInteractable && elementInteractable !== this.target && !elementInteractable.options.drag.manualStart && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag' && checkAxis(axis, elementInteractable)) {

                                        this.prepared.name = 'drag';
                                        this.target = elementInteractable;
                                        this.element = element;
                                        break;
                                    }

                                    element = parentElement(element);
                                }

                                if (!this.prepared.name) {
                                    var thisInteraction = this;

                                    var getDraggable = function getDraggable(interactable, selector, context) {
                                        var elements = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;

                                        if (interactable === thisInteraction.target) {
                                            return;
                                        }

                                        if (inContext(interactable, eventTarget) && !interactable.options.drag.manualStart && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, elements) && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag' && checkAxis(axis, interactable) && withinInteractionLimit(interactable, element, 'drag')) {

                                            return interactable;
                                        }
                                    };

                                    element = eventTarget;

                                    while (isElement(element)) {
                                        var selectorInteractable = interactables.forEachSelector(getDraggable);

                                        if (selectorInteractable) {
                                            this.prepared.name = 'drag';
                                            this.target = selectorInteractable;
                                            this.element = element;
                                            break;
                                        }

                                        element = parentElement(element);
                                    }
                                }
                            }
                        }
                    }

                    var starting = !!this.prepared.name && !this.interacting();

                    if (starting && (this.target.options[this.prepared.name].manualStart || !withinInteractionLimit(this.target, this.element, this.prepared))) {
                        this.stop(event);
                        return;
                    }

                    if (this.prepared.name && this.target) {
                        if (starting) {
                            this.start(this.prepared, this.target, this.element);
                        }

                        var shouldMove = this.setModifications(this.curCoords.page, preEnd);

                        if (shouldMove || starting) {
                            this.prevEvent = this[this.prepared.name + 'Move'](event);
                        }

                        this.checkAndPreventDefault(event, this.target, this.element);
                    }
                }

                copyCoords(this.prevCoords, this.curCoords);

                if (this.dragging || this.resizing) {
                    this.autoScrollMove(pointer);
                }
            },

            dragStart: function dragStart(event) {
                var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

                this.dragging = true;
                this.target.fire(dragEvent);

                this.activeDrops.dropzones = [];
                this.activeDrops.elements = [];
                this.activeDrops.rects = [];

                if (!this.dynamicDrop) {
                    this.setActiveDrops(this.element);
                }

                var dropEvents = this.getDropEvents(event, dragEvent);

                if (dropEvents.activate) {
                    this.fireActiveDrops(dropEvents.activate);
                }

                return dragEvent;
            },

            dragMove: function dragMove(event) {
                var target = this.target,
                    dragEvent = new InteractEvent(this, event, 'drag', 'move', this.element),
                    draggableElement = this.element,
                    drop = this.getDrop(dragEvent, event, draggableElement);

                this.dropTarget = drop.dropzone;
                this.dropElement = drop.element;

                var dropEvents = this.getDropEvents(event, dragEvent);

                target.fire(dragEvent);

                if (dropEvents.leave) {
                    this.prevDropTarget.fire(dropEvents.leave);
                }
                if (dropEvents.enter) {
                    this.dropTarget.fire(dropEvents.enter);
                }
                if (dropEvents.move) {
                    this.dropTarget.fire(dropEvents.move);
                }

                this.prevDropTarget = this.dropTarget;
                this.prevDropElement = this.dropElement;

                return dragEvent;
            },

            resizeStart: function resizeStart(event) {
                var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

                if (this.prepared.edges) {
                    var startRect = this.target.getRect(this.element);

                    if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
                        var linkedEdges = extend({}, this.prepared.edges);

                        linkedEdges.top = linkedEdges.top || linkedEdges.left && !linkedEdges.bottom;
                        linkedEdges.left = linkedEdges.left || linkedEdges.top && !linkedEdges.right;
                        linkedEdges.bottom = linkedEdges.bottom || linkedEdges.right && !linkedEdges.top;
                        linkedEdges.right = linkedEdges.right || linkedEdges.bottom && !linkedEdges.left;

                        this.prepared._linkedEdges = linkedEdges;
                    } else {
                        this.prepared._linkedEdges = null;
                    }

                    if (this.target.options.resize.preserveAspectRatio) {
                        this.resizeStartAspectRatio = startRect.width / startRect.height;
                    }

                    this.resizeRects = {
                        start: startRect,
                        current: extend({}, startRect),
                        restricted: extend({}, startRect),
                        previous: extend({}, startRect),
                        delta: {
                            left: 0, right: 0, width: 0,
                            top: 0, bottom: 0, height: 0
                        }
                    };

                    resizeEvent.rect = this.resizeRects.restricted;
                    resizeEvent.deltaRect = this.resizeRects.delta;
                }

                this.target.fire(resizeEvent);

                this.resizing = true;

                return resizeEvent;
            },

            resizeMove: function resizeMove(event) {
                var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

                var edges = this.prepared.edges,
                    invert = this.target.options.resize.invert,
                    invertible = invert === 'reposition' || invert === 'negate';

                if (edges) {
                    var dx = resizeEvent.dx,
                        dy = resizeEvent.dy,
                        start = this.resizeRects.start,
                        current = this.resizeRects.current,
                        restricted = this.resizeRects.restricted,
                        delta = this.resizeRects.delta,
                        previous = extend(this.resizeRects.previous, restricted),
                        originalEdges = edges;

                    if (this.target.options.resize.preserveAspectRatio) {
                        var resizeStartAspectRatio = this.resizeStartAspectRatio;

                        edges = this.prepared._linkedEdges;

                        if (originalEdges.left && originalEdges.bottom || originalEdges.right && originalEdges.top) {
                            dy = -dx / resizeStartAspectRatio;
                        } else if (originalEdges.left || originalEdges.right) {
                            dy = dx / resizeStartAspectRatio;
                        } else if (originalEdges.top || originalEdges.bottom) {
                            dx = dy * resizeStartAspectRatio;
                        }
                    } else if (this.target.options.resize.square) {
                        edges = this.prepared._linkedEdges;

                        if (originalEdges.left && originalEdges.bottom || originalEdges.right && originalEdges.top) {
                            dy = -dx;
                        } else if (originalEdges.left || originalEdges.right) {
                            dy = dx;
                        } else if (originalEdges.top || originalEdges.bottom) {
                            dx = dy;
                        }
                    }

                    if (edges.top) {
                        current.top += dy;
                    }
                    if (edges.bottom) {
                        current.bottom += dy;
                    }
                    if (edges.left) {
                        current.left += dx;
                    }
                    if (edges.right) {
                        current.right += dx;
                    }

                    if (invertible) {
                        extend(restricted, current);

                        if (invert === 'reposition') {
                            var swap;

                            if (restricted.top > restricted.bottom) {
                                swap = restricted.top;

                                restricted.top = restricted.bottom;
                                restricted.bottom = swap;
                            }
                            if (restricted.left > restricted.right) {
                                swap = restricted.left;

                                restricted.left = restricted.right;
                                restricted.right = swap;
                            }
                        }
                    } else {
                        restricted.top = Math.min(current.top, start.bottom);
                        restricted.bottom = Math.max(current.bottom, start.top);
                        restricted.left = Math.min(current.left, start.right);
                        restricted.right = Math.max(current.right, start.left);
                    }

                    restricted.width = restricted.right - restricted.left;
                    restricted.height = restricted.bottom - restricted.top;

                    for (var edge in restricted) {
                        delta[edge] = restricted[edge] - previous[edge];
                    }

                    resizeEvent.edges = this.prepared.edges;
                    resizeEvent.rect = restricted;
                    resizeEvent.deltaRect = delta;
                }

                this.target.fire(resizeEvent);

                return resizeEvent;
            },

            gestureStart: function gestureStart(event) {
                var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

                gestureEvent.ds = 0;

                this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
                this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
                this.gesture.scale = 1;

                this.gesturing = true;

                this.target.fire(gestureEvent);

                return gestureEvent;
            },

            gestureMove: function gestureMove(event) {
                if (!this.pointerIds.length) {
                    return this.prevEvent;
                }

                var gestureEvent;

                gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
                gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

                this.target.fire(gestureEvent);

                this.gesture.prevAngle = gestureEvent.angle;
                this.gesture.prevDistance = gestureEvent.distance;

                if (gestureEvent.scale !== Infinity && gestureEvent.scale !== null && gestureEvent.scale !== undefined && !isNaN(gestureEvent.scale)) {

                    this.gesture.scale = gestureEvent.scale;
                }

                return gestureEvent;
            },

            pointerHold: function pointerHold(pointer, event, eventTarget) {
                this.collectEventTargets(pointer, event, eventTarget, 'hold');
            },

            pointerUp: function pointerUp(pointer, event, eventTarget, curEventTarget) {
                var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));

                clearTimeout(this.holdTimers[pointerIndex]);

                this.collectEventTargets(pointer, event, eventTarget, 'up');
                this.collectEventTargets(pointer, event, eventTarget, 'tap');

                this.pointerEnd(pointer, event, eventTarget, curEventTarget);

                this.removePointer(pointer);
            },

            pointerCancel: function pointerCancel(pointer, event, eventTarget, curEventTarget) {
                var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));

                clearTimeout(this.holdTimers[pointerIndex]);

                this.collectEventTargets(pointer, event, eventTarget, 'cancel');
                this.pointerEnd(pointer, event, eventTarget, curEventTarget);

                this.removePointer(pointer);
            },

            ie8Dblclick: function ie8Dblclick(pointer, event, eventTarget) {
                if (this.prevTap && event.clientX === this.prevTap.clientX && event.clientY === this.prevTap.clientY && eventTarget === this.prevTap.target) {

                    this.downTargets[0] = eventTarget;
                    this.downTimes[0] = new Date().getTime();
                    this.collectEventTargets(pointer, event, eventTarget, 'tap');
                }
            },

            pointerEnd: function pointerEnd(pointer, event, eventTarget, curEventTarget) {
                var endEvent,
                    target = this.target,
                    options = target && target.options,
                    inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
                    inertiaStatus = this.inertiaStatus;

                if (this.interacting()) {

                    if (inertiaStatus.active && !inertiaStatus.ending) {
                        return;
                    }

                    var pointerSpeed,
                        now = new Date().getTime(),
                        inertiaPossible = false,
                        inertia = false,
                        smoothEnd = false,
                        endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
                        endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
                        dx = 0,
                        dy = 0,
                        startEvent;

                    if (this.dragging) {
                        if (options.drag.axis === 'x') {
                            pointerSpeed = Math.abs(this.pointerDelta.client.vx);
                        } else if (options.drag.axis === 'y') {
                            pointerSpeed = Math.abs(this.pointerDelta.client.vy);
                        } else {
                                pointerSpeed = this.pointerDelta.client.speed;
                            }
                    } else {
                        pointerSpeed = this.pointerDelta.client.speed;
                    }

                    inertiaPossible = inertiaOptions && inertiaOptions.enabled && this.prepared.name !== 'gesture' && event !== inertiaStatus.startEvent;

                    inertia = inertiaPossible && now - this.curCoords.timeStamp < 50 && pointerSpeed > inertiaOptions.minSpeed && pointerSpeed > inertiaOptions.endSpeed;

                    if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

                        var snapRestrict = {};

                        snapRestrict.snap = snapRestrict.restrict = snapRestrict;

                        if (endSnap) {
                            this.setSnapping(this.curCoords.page, snapRestrict);
                            if (snapRestrict.locked) {
                                dx += snapRestrict.dx;
                                dy += snapRestrict.dy;
                            }
                        }

                        if (endRestrict) {
                            this.setRestriction(this.curCoords.page, snapRestrict);
                            if (snapRestrict.restricted) {
                                dx += snapRestrict.dx;
                                dy += snapRestrict.dy;
                            }
                        }

                        if (dx || dy) {
                            smoothEnd = true;
                        }
                    }

                    if (inertia || smoothEnd) {
                        copyCoords(inertiaStatus.upCoords, this.curCoords);

                        this.pointers[0] = inertiaStatus.startEvent = startEvent = new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

                        inertiaStatus.t0 = now;

                        target.fire(inertiaStatus.startEvent);

                        if (inertia) {
                            inertiaStatus.vx0 = this.pointerDelta.client.vx;
                            inertiaStatus.vy0 = this.pointerDelta.client.vy;
                            inertiaStatus.v0 = pointerSpeed;

                            this.calcInertia(inertiaStatus);

                            var page = extend({}, this.curCoords.page),
                                origin = getOriginXY(target, this.element),
                                statusObject;

                            page.x = page.x + inertiaStatus.xe - origin.x;
                            page.y = page.y + inertiaStatus.ye - origin.y;

                            statusObject = {
                                useStatusXY: true,
                                x: page.x,
                                y: page.y,
                                dx: 0,
                                dy: 0,
                                snap: null
                            };

                            statusObject.snap = statusObject;

                            dx = dy = 0;

                            if (endSnap) {
                                var snap = this.setSnapping(this.curCoords.page, statusObject);

                                if (snap.locked) {
                                    dx += snap.dx;
                                    dy += snap.dy;
                                }
                            }

                            if (endRestrict) {
                                var restrict = this.setRestriction(this.curCoords.page, statusObject);

                                if (restrict.restricted) {
                                    dx += restrict.dx;
                                    dy += restrict.dy;
                                }
                            }

                            inertiaStatus.modifiedXe += dx;
                            inertiaStatus.modifiedYe += dy;

                            inertiaStatus.i = reqFrame(this.boundInertiaFrame);
                        } else {
                            inertiaStatus.smoothEnd = true;
                            inertiaStatus.xe = dx;
                            inertiaStatus.ye = dy;

                            inertiaStatus.sx = inertiaStatus.sy = 0;

                            inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
                        }

                        inertiaStatus.active = true;
                        return;
                    }

                    if (endSnap || endRestrict) {
                        this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
                    }
                }

                if (this.dragging) {
                    endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

                    var draggableElement = this.element,
                        drop = this.getDrop(endEvent, event, draggableElement);

                    this.dropTarget = drop.dropzone;
                    this.dropElement = drop.element;

                    var dropEvents = this.getDropEvents(event, endEvent);

                    if (dropEvents.leave) {
                        this.prevDropTarget.fire(dropEvents.leave);
                    }
                    if (dropEvents.enter) {
                        this.dropTarget.fire(dropEvents.enter);
                    }
                    if (dropEvents.drop) {
                        this.dropTarget.fire(dropEvents.drop);
                    }
                    if (dropEvents.deactivate) {
                        this.fireActiveDrops(dropEvents.deactivate);
                    }

                    target.fire(endEvent);
                } else if (this.resizing) {
                    endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
                    target.fire(endEvent);
                } else if (this.gesturing) {
                    endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
                    target.fire(endEvent);
                }

                this.stop(event);
            },

            collectDrops: function collectDrops(element) {
                var drops = [],
                    elements = [],
                    i;

                element = element || this.element;

                for (i = 0; i < interactables.length; i++) {
                    if (!interactables[i].options.drop.enabled) {
                        continue;
                    }

                    var current = interactables[i],
                        accept = current.options.drop.accept;

                    if (isElement(accept) && accept !== element || isString(accept) && !matchesSelector(element, accept)) {

                        continue;
                    }

                    var dropElements = current.selector ? current._context.querySelectorAll(current.selector) : [current._element];

                    for (var j = 0, len = dropElements.length; j < len; j++) {
                        var currentElement = dropElements[j];

                        if (currentElement === element) {
                            continue;
                        }

                        drops.push(current);
                        elements.push(currentElement);
                    }
                }

                return {
                    dropzones: drops,
                    elements: elements
                };
            },

            fireActiveDrops: function fireActiveDrops(event) {
                var i, current, currentElement, prevElement;

                for (i = 0; i < this.activeDrops.dropzones.length; i++) {
                    current = this.activeDrops.dropzones[i];
                    currentElement = this.activeDrops.elements[i];

                    if (currentElement !== prevElement) {
                        event.target = currentElement;
                        current.fire(event);
                    }
                    prevElement = currentElement;
                }
            },

            setActiveDrops: function setActiveDrops(dragElement) {
                var possibleDrops = this.collectDrops(dragElement, true);

                this.activeDrops.dropzones = possibleDrops.dropzones;
                this.activeDrops.elements = possibleDrops.elements;
                this.activeDrops.rects = [];

                for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
                    this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
                }
            },

            getDrop: function getDrop(dragEvent, event, dragElement) {
                var validDrops = [];

                if (dynamicDrop) {
                    this.setActiveDrops(dragElement);
                }

                for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
                    var current = this.activeDrops.dropzones[j],
                        currentElement = this.activeDrops.elements[j],
                        rect = this.activeDrops.rects[j];

                    validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect) ? currentElement : null);
                }

                var dropIndex = indexOfDeepestElement(validDrops),
                    dropzone = this.activeDrops.dropzones[dropIndex] || null,
                    element = this.activeDrops.elements[dropIndex] || null;

                return {
                    dropzone: dropzone,
                    element: element
                };
            },

            getDropEvents: function getDropEvents(pointerEvent, dragEvent) {
                var dropEvents = {
                    enter: null,
                    leave: null,
                    activate: null,
                    deactivate: null,
                    move: null,
                    drop: null
                };

                if (this.dropElement !== this.prevDropElement) {
                    if (this.prevDropTarget) {
                        dropEvents.leave = {
                            target: this.prevDropElement,
                            dropzone: this.prevDropTarget,
                            relatedTarget: dragEvent.target,
                            draggable: dragEvent.interactable,
                            dragEvent: dragEvent,
                            interaction: this,
                            timeStamp: dragEvent.timeStamp,
                            type: 'dragleave'
                        };

                        dragEvent.dragLeave = this.prevDropElement;
                        dragEvent.prevDropzone = this.prevDropTarget;
                    }

                    if (this.dropTarget) {
                        dropEvents.enter = {
                            target: this.dropElement,
                            dropzone: this.dropTarget,
                            relatedTarget: dragEvent.target,
                            draggable: dragEvent.interactable,
                            dragEvent: dragEvent,
                            interaction: this,
                            timeStamp: dragEvent.timeStamp,
                            type: 'dragenter'
                        };

                        dragEvent.dragEnter = this.dropElement;
                        dragEvent.dropzone = this.dropTarget;
                    }
                }

                if (dragEvent.type === 'dragend' && this.dropTarget) {
                    dropEvents.drop = {
                        target: this.dropElement,
                        dropzone: this.dropTarget,
                        relatedTarget: dragEvent.target,
                        draggable: dragEvent.interactable,
                        dragEvent: dragEvent,
                        interaction: this,
                        timeStamp: dragEvent.timeStamp,
                        type: 'drop'
                    };

                    dragEvent.dropzone = this.dropTarget;
                }
                if (dragEvent.type === 'dragstart') {
                    dropEvents.activate = {
                        target: null,
                        dropzone: null,
                        relatedTarget: dragEvent.target,
                        draggable: dragEvent.interactable,
                        dragEvent: dragEvent,
                        interaction: this,
                        timeStamp: dragEvent.timeStamp,
                        type: 'dropactivate'
                    };
                }
                if (dragEvent.type === 'dragend') {
                    dropEvents.deactivate = {
                        target: null,
                        dropzone: null,
                        relatedTarget: dragEvent.target,
                        draggable: dragEvent.interactable,
                        dragEvent: dragEvent,
                        interaction: this,
                        timeStamp: dragEvent.timeStamp,
                        type: 'dropdeactivate'
                    };
                }
                if (dragEvent.type === 'dragmove' && this.dropTarget) {
                    dropEvents.move = {
                        target: this.dropElement,
                        dropzone: this.dropTarget,
                        relatedTarget: dragEvent.target,
                        draggable: dragEvent.interactable,
                        dragEvent: dragEvent,
                        interaction: this,
                        dragmove: dragEvent,
                        timeStamp: dragEvent.timeStamp,
                        type: 'dropmove'
                    };
                    dragEvent.dropzone = this.dropTarget;
                }

                return dropEvents;
            },

            currentAction: function currentAction() {
                return this.dragging && 'drag' || this.resizing && 'resize' || this.gesturing && 'gesture' || null;
            },

            interacting: function interacting() {
                return this.dragging || this.resizing || this.gesturing;
            },

            clearTargets: function clearTargets() {
                this.target = this.element = null;

                this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
            },

            stop: function stop(event) {
                if (this.interacting()) {
                    autoScroll.stop();
                    this.matches = [];
                    this.matchElements = [];

                    var target = this.target;

                    if (target.options.styleCursor) {
                        target._doc.documentElement.style.cursor = '';
                    }

                    if (event && isFunction(event.preventDefault)) {
                        this.checkAndPreventDefault(event, target, this.element);
                    }

                    if (this.dragging) {
                        this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
                    }
                }

                this.clearTargets();

                this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
                this.prepared.name = this.prevEvent = null;
                this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

                for (var i = 0; i < this.pointers.length; i++) {
                    if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
                        this.pointers.splice(i, 1);
                    }
                }
            },

            inertiaFrame: function inertiaFrame() {
                var inertiaStatus = this.inertiaStatus,
                    options = this.target.options[this.prepared.name].inertia,
                    lambda = options.resistance,
                    t = new Date().getTime() / 1000 - inertiaStatus.t0;

                if (t < inertiaStatus.te) {

                    var progress = 1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

                    if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
                        inertiaStatus.sx = inertiaStatus.xe * progress;
                        inertiaStatus.sy = inertiaStatus.ye * progress;
                    } else {
                        var quadPoint = getQuadraticCurvePoint(0, 0, inertiaStatus.xe, inertiaStatus.ye, inertiaStatus.modifiedXe, inertiaStatus.modifiedYe, progress);

                        inertiaStatus.sx = quadPoint.x;
                        inertiaStatus.sy = quadPoint.y;
                    }

                    this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                    inertiaStatus.i = reqFrame(this.boundInertiaFrame);
                } else {
                    inertiaStatus.ending = true;

                    inertiaStatus.sx = inertiaStatus.modifiedXe;
                    inertiaStatus.sy = inertiaStatus.modifiedYe;

                    this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                    this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                    inertiaStatus.active = inertiaStatus.ending = false;
                }
            },

            smoothEndFrame: function smoothEndFrame() {
                var inertiaStatus = this.inertiaStatus,
                    t = new Date().getTime() - inertiaStatus.t0,
                    duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

                if (t < duration) {
                    inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
                    inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

                    this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                    inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
                } else {
                    inertiaStatus.ending = true;

                    inertiaStatus.sx = inertiaStatus.xe;
                    inertiaStatus.sy = inertiaStatus.ye;

                    this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                    this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                    inertiaStatus.smoothEnd = inertiaStatus.active = inertiaStatus.ending = false;
                }
            },

            addPointer: function addPointer(pointer) {
                var id = getPointerId(pointer),
                    index = this.mouse ? 0 : indexOf(this.pointerIds, id);

                if (index === -1) {
                    index = this.pointerIds.length;
                }

                this.pointerIds[index] = id;
                this.pointers[index] = pointer;

                return index;
            },

            removePointer: function removePointer(pointer) {
                var id = getPointerId(pointer),
                    index = this.mouse ? 0 : indexOf(this.pointerIds, id);

                if (index === -1) {
                    return;
                }

                this.pointers.splice(index, 1);
                this.pointerIds.splice(index, 1);
                this.downTargets.splice(index, 1);
                this.downTimes.splice(index, 1);
                this.holdTimers.splice(index, 1);
            },

            recordPointer: function recordPointer(pointer) {
                var index = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));

                if (index === -1) {
                    return;
                }

                this.pointers[index] = pointer;
            },

            collectEventTargets: function collectEventTargets(pointer, event, eventTarget, eventType) {
                var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));

                if (eventType === 'tap' && (this.pointerWasMoved || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
                    return;
                }

                var targets = [],
                    elements = [],
                    element = eventTarget;

                function collectSelectors(interactable, selector, context) {
                    var els = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;

                    if (interactable._iEvents[eventType] && isElement(element) && inContext(interactable, element) && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, els)) {

                        targets.push(interactable);
                        elements.push(element);
                    }
                }

                while (element) {
                    if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
                        targets.push(interact(element));
                        elements.push(element);
                    }

                    interactables.forEachSelector(collectSelectors);

                    element = parentElement(element);
                }

                if (targets.length || eventType === 'tap') {
                    this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
                }
            },

            firePointers: function firePointers(pointer, event, eventTarget, targets, elements, eventType) {
                var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
                    pointerEvent = {},
                    i,
                    interval,
                    createNewDoubleTap;

                if (eventType === 'doubletap') {
                    pointerEvent = pointer;
                } else {
                    pointerExtend(pointerEvent, event);
                    if (event !== pointer) {
                        pointerExtend(pointerEvent, pointer);
                    }

                    pointerEvent.preventDefault = preventOriginalDefault;
                    pointerEvent.stopPropagation = InteractEvent.prototype.stopPropagation;
                    pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
                    pointerEvent.interaction = this;

                    pointerEvent.timeStamp = new Date().getTime();
                    pointerEvent.originalEvent = event;
                    pointerEvent.originalPointer = pointer;
                    pointerEvent.type = eventType;
                    pointerEvent.pointerId = getPointerId(pointer);
                    pointerEvent.pointerType = this.mouse ? 'mouse' : !supportsPointerEvent ? 'touch' : isString(pointer.pointerType) ? pointer.pointerType : [,, 'touch', 'pen', 'mouse'][pointer.pointerType];
                }

                if (eventType === 'tap') {
                    pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

                    interval = pointerEvent.timeStamp - this.tapTime;
                    createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap' && this.prevTap.target === pointerEvent.target && interval < 500);

                    pointerEvent.double = createNewDoubleTap;

                    this.tapTime = pointerEvent.timeStamp;
                }

                for (i = 0; i < targets.length; i++) {
                    pointerEvent.currentTarget = elements[i];
                    pointerEvent.interactable = targets[i];
                    targets[i].fire(pointerEvent);

                    if (pointerEvent.immediatePropagationStopped || pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget) {
                        break;
                    }
                }

                if (createNewDoubleTap) {
                    var doubleTap = {};

                    extend(doubleTap, pointerEvent);

                    doubleTap.dt = interval;
                    doubleTap.type = 'doubletap';

                    this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

                    this.prevTap = doubleTap;
                } else if (eventType === 'tap') {
                    this.prevTap = pointerEvent;
                }
            },

            validateSelector: function validateSelector(pointer, event, matches, matchElements) {
                for (var i = 0, len = matches.length; i < len; i++) {
                    var match = matches[i],
                        matchElement = matchElements[i],
                        action = validateAction(match.getAction(pointer, event, this, matchElement), match);

                    if (action && withinInteractionLimit(match, matchElement, action)) {
                        this.target = match;
                        this.element = matchElement;

                        return action;
                    }
                }
            },

            setSnapping: function setSnapping(pageCoords, status) {
                var snap = this.target.options[this.prepared.name].snap,
                    targets = [],
                    target,
                    page,
                    i;

                status = status || this.snapStatus;

                if (status.useStatusXY) {
                    page = { x: status.x, y: status.y };
                } else {
                    var origin = getOriginXY(this.target, this.element);

                    page = extend({}, pageCoords);

                    page.x -= origin.x;
                    page.y -= origin.y;
                }

                status.realX = page.x;
                status.realY = page.y;

                page.x = page.x - this.inertiaStatus.resumeDx;
                page.y = page.y - this.inertiaStatus.resumeDy;

                var len = snap.targets ? snap.targets.length : 0;

                for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
                    var relative = {
                        x: page.x - this.snapOffsets[relIndex].x,
                        y: page.y - this.snapOffsets[relIndex].y
                    };

                    for (i = 0; i < len; i++) {
                        if (isFunction(snap.targets[i])) {
                            target = snap.targets[i](relative.x, relative.y, this);
                        } else {
                            target = snap.targets[i];
                        }

                        if (!target) {
                            continue;
                        }

                        targets.push({
                            x: isNumber(target.x) ? target.x + this.snapOffsets[relIndex].x : relative.x,
                            y: isNumber(target.y) ? target.y + this.snapOffsets[relIndex].y : relative.y,

                            range: isNumber(target.range) ? target.range : snap.range
                        });
                    }
                }

                var closest = {
                    target: null,
                    inRange: false,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0
                };

                for (i = 0, len = targets.length; i < len; i++) {
                    target = targets[i];

                    var range = target.range,
                        dx = target.x - page.x,
                        dy = target.y - page.y,
                        distance = hypot(dx, dy),
                        inRange = distance <= range;

                    if (range === Infinity && closest.inRange && closest.range !== Infinity) {
                        inRange = false;
                    }

                    if (!closest.target || (inRange ? closest.inRange && range !== Infinity ? distance / range < closest.distance / closest.range : range === Infinity && closest.range !== Infinity || distance < closest.distance : !closest.inRange && distance < closest.distance)) {

                        if (range === Infinity) {
                            inRange = true;
                        }

                        closest.target = target;
                        closest.distance = distance;
                        closest.range = range;
                        closest.inRange = inRange;
                        closest.dx = dx;
                        closest.dy = dy;

                        status.range = range;
                    }
                }

                var snapChanged;

                if (closest.target) {
                    snapChanged = status.snappedX !== closest.target.x || status.snappedY !== closest.target.y;

                    status.snappedX = closest.target.x;
                    status.snappedY = closest.target.y;
                } else {
                    snapChanged = true;

                    status.snappedX = NaN;
                    status.snappedY = NaN;
                }

                status.dx = closest.dx;
                status.dy = closest.dy;

                status.changed = snapChanged || closest.inRange && !status.locked;
                status.locked = closest.inRange;

                return status;
            },

            setRestriction: function setRestriction(pageCoords, status) {
                var target = this.target,
                    restrict = target && target.options[this.prepared.name].restrict,
                    restriction = restrict && restrict.restriction,
                    page;

                if (!restriction) {
                    return status;
                }

                status = status || this.restrictStatus;

                page = status.useStatusXY ? page = { x: status.x, y: status.y } : page = extend({}, pageCoords);

                if (status.snap && status.snap.locked) {
                    page.x += status.snap.dx || 0;
                    page.y += status.snap.dy || 0;
                }

                page.x -= this.inertiaStatus.resumeDx;
                page.y -= this.inertiaStatus.resumeDy;

                status.dx = 0;
                status.dy = 0;
                status.restricted = false;

                var rect, restrictedX, restrictedY;

                if (isString(restriction)) {
                    if (restriction === 'parent') {
                        restriction = parentElement(this.element);
                    } else if (restriction === 'self') {
                        restriction = target.getRect(this.element);
                    } else {
                        restriction = closest(this.element, restriction);
                    }

                    if (!restriction) {
                        return status;
                    }
                }

                if (isFunction(restriction)) {
                    restriction = restriction(page.x, page.y, this.element);
                }

                if (isElement(restriction)) {
                    restriction = getElementRect(restriction);
                }

                rect = restriction;

                if (!restriction) {
                    restrictedX = page.x;
                    restrictedY = page.y;
                } else if ('x' in restriction && 'y' in restriction) {
                        restrictedX = Math.max(Math.min(rect.x + rect.width - this.restrictOffset.right, page.x), rect.x + this.restrictOffset.left);
                        restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top);
                    } else {
                        restrictedX = Math.max(Math.min(rect.right - this.restrictOffset.right, page.x), rect.left + this.restrictOffset.left);
                        restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top + this.restrictOffset.top);
                    }

                status.dx = restrictedX - page.x;
                status.dy = restrictedY - page.y;

                status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
                status.restricted = !!(status.dx || status.dy);

                status.restrictedX = restrictedX;
                status.restrictedY = restrictedY;

                return status;
            },

            checkAndPreventDefault: function checkAndPreventDefault(event, interactable, element) {
                if (!(interactable = interactable || this.target)) {
                    return;
                }

                var options = interactable.options,
                    prevent = options.preventDefault;

                if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
                    if (/down|start/i.test(event.type) && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

                        return;
                    }

                    if (options[this.prepared.name] && options[this.prepared.name].manualStart && !this.interacting()) {
                        return;
                    }

                    event.preventDefault();
                    return;
                }

                if (prevent === 'always') {
                    event.preventDefault();
                    return;
                }
            },

            calcInertia: function calcInertia(status) {
                var inertiaOptions = this.target.options[this.prepared.name].inertia,
                    lambda = inertiaOptions.resistance,
                    inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

                status.x0 = this.prevEvent.pageX;
                status.y0 = this.prevEvent.pageY;
                status.t0 = status.startEvent.timeStamp / 1000;
                status.sx = status.sy = 0;

                status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
                status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
                status.te = inertiaDur;

                status.lambda_v0 = lambda / status.v0;
                status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
            },

            autoScrollMove: function autoScrollMove(pointer) {
                if (!(this.interacting() && checkAutoScroll(this.target, this.prepared.name))) {
                    return;
                }

                if (this.inertiaStatus.active) {
                    autoScroll.x = autoScroll.y = 0;
                    return;
                }

                var top,
                    right,
                    bottom,
                    left,
                    options = this.target.options[this.prepared.name].autoScroll,
                    container = options.container || getWindow(this.element);

                if (isWindow(container)) {
                    left = pointer.clientX < autoScroll.margin;
                    top = pointer.clientY < autoScroll.margin;
                    right = pointer.clientX > container.innerWidth - autoScroll.margin;
                    bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
                } else {
                    var rect = getElementClientRect(container);

                    left = pointer.clientX < rect.left + autoScroll.margin;
                    top = pointer.clientY < rect.top + autoScroll.margin;
                    right = pointer.clientX > rect.right - autoScroll.margin;
                    bottom = pointer.clientY > rect.bottom - autoScroll.margin;
                }

                autoScroll.x = right ? 1 : left ? -1 : 0;
                autoScroll.y = bottom ? 1 : top ? -1 : 0;

                if (!autoScroll.isScrolling) {
                    autoScroll.margin = options.margin;
                    autoScroll.speed = options.speed;

                    autoScroll.start(this);
                }
            },

            _updateEventTargets: function _updateEventTargets(target, currentTarget) {
                this._eventTarget = target;
                this._curEventTarget = currentTarget;
            }

        };

        function getInteractionFromPointer(pointer, eventType, eventTarget) {
            var i = 0,
                len = interactions.length,
                mouseEvent = /mouse/i.test(pointer.pointerType || eventType) || pointer.pointerType === 4,
                interaction;

            var id = getPointerId(pointer);

            if (/down|start/i.test(eventType)) {
                for (i = 0; i < len; i++) {
                    interaction = interactions[i];

                    var element = eventTarget;

                    if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume && interaction.mouse === mouseEvent) {
                        while (element) {
                            if (element === interaction.element) {
                                return interaction;
                            }
                            element = parentElement(element);
                        }
                    }
                }
            }

            if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {
                for (i = 0; i < len; i++) {
                    if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
                        return interactions[i];
                    }
                }

                for (i = 0; i < len; i++) {
                    if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
                        return interaction;
                    }
                }

                interaction = new Interaction();
                interaction.mouse = true;

                return interaction;
            }

            for (i = 0; i < len; i++) {
                if (contains(interactions[i].pointerIds, id)) {
                    return interactions[i];
                }
            }

            if (/up|end|out/i.test(eventType)) {
                return null;
            }

            for (i = 0; i < len; i++) {
                interaction = interactions[i];

                if ((!interaction.prepared.name || interaction.target.options.gesture.enabled) && !interaction.interacting() && !(!mouseEvent && interaction.mouse)) {

                    return interaction;
                }
            }

            return new Interaction();
        }

        function doOnInteractions(method) {
            return function (event) {
                var interaction,
                    eventTarget = getActualElement(event.path ? event.path[0] : event.target),
                    curEventTarget = getActualElement(event.currentTarget),
                    i;

                if (supportsTouch && /touch/.test(event.type)) {
                    prevTouchTime = new Date().getTime();

                    for (i = 0; i < event.changedTouches.length; i++) {
                        var pointer = event.changedTouches[i];

                        interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

                        if (!interaction) {
                            continue;
                        }

                        interaction._updateEventTargets(eventTarget, curEventTarget);

                        interaction[method](pointer, event, eventTarget, curEventTarget);
                    }
                } else {
                    if (!supportsPointerEvent && /mouse/.test(event.type)) {
                        for (i = 0; i < interactions.length; i++) {
                            if (!interactions[i].mouse && interactions[i].pointerIsDown) {
                                return;
                            }
                        }

                        if (new Date().getTime() - prevTouchTime < 500) {
                            return;
                        }
                    }

                    interaction = getInteractionFromPointer(event, event.type, eventTarget);

                    if (!interaction) {
                        return;
                    }

                    interaction._updateEventTargets(eventTarget, curEventTarget);

                    interaction[method](event, event, eventTarget, curEventTarget);
                }
            };
        }

        function InteractEvent(interaction, event, action, phase, element, related) {
            var client,
                page,
                target = interaction.target,
                snapStatus = interaction.snapStatus,
                restrictStatus = interaction.restrictStatus,
                pointers = interaction.pointers,
                deltaSource = (target && target.options || defaultOptions).deltaSource,
                sourceX = deltaSource + 'X',
                sourceY = deltaSource + 'Y',
                options = target ? target.options : defaultOptions,
                origin = getOriginXY(target, element),
                starting = phase === 'start',
                ending = phase === 'end',
                coords = starting ? interaction.startCoords : interaction.curCoords;

            element = element || interaction.element;

            page = extend({}, coords.page);
            client = extend({}, coords.client);

            page.x -= origin.x;
            page.y -= origin.y;

            client.x -= origin.x;
            client.y -= origin.y;

            var relativePoints = options[action].snap && options[action].snap.relativePoints;

            if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
                this.snap = {
                    range: snapStatus.range,
                    locked: snapStatus.locked,
                    x: snapStatus.snappedX,
                    y: snapStatus.snappedY,
                    realX: snapStatus.realX,
                    realY: snapStatus.realY,
                    dx: snapStatus.dx,
                    dy: snapStatus.dy
                };

                if (snapStatus.locked) {
                    page.x += snapStatus.dx;
                    page.y += snapStatus.dy;
                    client.x += snapStatus.dx;
                    client.y += snapStatus.dy;
                }
            }

            if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
                page.x += restrictStatus.dx;
                page.y += restrictStatus.dy;
                client.x += restrictStatus.dx;
                client.y += restrictStatus.dy;

                this.restrict = {
                    dx: restrictStatus.dx,
                    dy: restrictStatus.dy
                };
            }

            this.pageX = page.x;
            this.pageY = page.y;
            this.clientX = client.x;
            this.clientY = client.y;

            this.x0 = interaction.startCoords.page.x - origin.x;
            this.y0 = interaction.startCoords.page.y - origin.y;
            this.clientX0 = interaction.startCoords.client.x - origin.x;
            this.clientY0 = interaction.startCoords.client.y - origin.y;
            this.ctrlKey = event.ctrlKey;
            this.altKey = event.altKey;
            this.shiftKey = event.shiftKey;
            this.metaKey = event.metaKey;
            this.button = event.button;
            this.buttons = event.buttons;
            this.target = element;
            this.t0 = interaction.downTimes[0];
            this.type = action + (phase || '');

            this.interaction = interaction;
            this.interactable = target;

            var inertiaStatus = interaction.inertiaStatus;

            if (inertiaStatus.active) {
                this.detail = 'inertia';
            }

            if (related) {
                this.relatedTarget = related;
            }

            if (ending) {
                if (deltaSource === 'client') {
                    this.dx = client.x - interaction.startCoords.client.x;
                    this.dy = client.y - interaction.startCoords.client.y;
                } else {
                    this.dx = page.x - interaction.startCoords.page.x;
                    this.dy = page.y - interaction.startCoords.page.y;
                }
            } else if (starting) {
                this.dx = 0;
                this.dy = 0;
            } else if (phase === 'inertiastart') {
                    this.dx = interaction.prevEvent.dx;
                    this.dy = interaction.prevEvent.dy;
                } else {
                    if (deltaSource === 'client') {
                        this.dx = client.x - interaction.prevEvent.clientX;
                        this.dy = client.y - interaction.prevEvent.clientY;
                    } else {
                        this.dx = page.x - interaction.prevEvent.pageX;
                        this.dy = page.y - interaction.prevEvent.pageY;
                    }
                }
            if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia' && !inertiaStatus.active && options[action].inertia && options[action].inertia.zeroResumeDelta) {

                inertiaStatus.resumeDx += this.dx;
                inertiaStatus.resumeDy += this.dy;

                this.dx = this.dy = 0;
            }

            if (action === 'resize' && interaction.resizeAxes) {
                if (options.resize.square) {
                    if (interaction.resizeAxes === 'y') {
                        this.dx = this.dy;
                    } else {
                        this.dy = this.dx;
                    }
                    this.axes = 'xy';
                } else {
                    this.axes = interaction.resizeAxes;

                    if (interaction.resizeAxes === 'x') {
                        this.dy = 0;
                    } else if (interaction.resizeAxes === 'y') {
                        this.dx = 0;
                    }
                }
            } else if (action === 'gesture') {
                this.touches = [pointers[0], pointers[1]];

                if (starting) {
                    this.distance = touchDistance(pointers, deltaSource);
                    this.box = touchBBox(pointers);
                    this.scale = 1;
                    this.ds = 0;
                    this.angle = touchAngle(pointers, undefined, deltaSource);
                    this.da = 0;
                } else if (ending || event instanceof InteractEvent) {
                    this.distance = interaction.prevEvent.distance;
                    this.box = interaction.prevEvent.box;
                    this.scale = interaction.prevEvent.scale;
                    this.ds = this.scale - 1;
                    this.angle = interaction.prevEvent.angle;
                    this.da = this.angle - interaction.gesture.startAngle;
                } else {
                    this.distance = touchDistance(pointers, deltaSource);
                    this.box = touchBBox(pointers);
                    this.scale = this.distance / interaction.gesture.startDistance;
                    this.angle = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

                    this.ds = this.scale - interaction.gesture.prevScale;
                    this.da = this.angle - interaction.gesture.prevAngle;
                }
            }

            if (starting) {
                this.timeStamp = interaction.downTimes[0];
                this.dt = 0;
                this.duration = 0;
                this.speed = 0;
                this.velocityX = 0;
                this.velocityY = 0;
            } else if (phase === 'inertiastart') {
                this.timeStamp = interaction.prevEvent.timeStamp;
                this.dt = interaction.prevEvent.dt;
                this.duration = interaction.prevEvent.duration;
                this.speed = interaction.prevEvent.speed;
                this.velocityX = interaction.prevEvent.velocityX;
                this.velocityY = interaction.prevEvent.velocityY;
            } else {
                this.timeStamp = new Date().getTime();
                this.dt = this.timeStamp - interaction.prevEvent.timeStamp;
                this.duration = this.timeStamp - interaction.downTimes[0];

                if (event instanceof InteractEvent) {
                    var dx = this[sourceX] - interaction.prevEvent[sourceX],
                        dy = this[sourceY] - interaction.prevEvent[sourceY],
                        dt = this.dt / 1000;

                    this.speed = hypot(dx, dy) / dt;
                    this.velocityX = dx / dt;
                    this.velocityY = dy / dt;
                } else {
                        this.speed = interaction.pointerDelta[deltaSource].speed;
                        this.velocityX = interaction.pointerDelta[deltaSource].vx;
                        this.velocityY = interaction.pointerDelta[deltaSource].vy;
                    }
            }

            if ((ending || phase === 'inertiastart') && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

                var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
                    overlap = 22.5;

                if (angle < 0) {
                    angle += 360;
                }

                var left = 135 - overlap <= angle && angle < 225 + overlap,
                    up = 225 - overlap <= angle && angle < 315 + overlap,
                    right = !left && (315 - overlap <= angle || angle < 45 + overlap),
                    down = !up && 45 - overlap <= angle && angle < 135 + overlap;

                this.swipe = {
                    up: up,
                    down: down,
                    left: left,
                    right: right,
                    angle: angle,
                    speed: interaction.prevEvent.speed,
                    velocity: {
                        x: interaction.prevEvent.velocityX,
                        y: interaction.prevEvent.velocityY
                    }
                };
            }
        }

        InteractEvent.prototype = {
            preventDefault: blank,
            stopImmediatePropagation: function stopImmediatePropagation() {
                this.immediatePropagationStopped = this.propagationStopped = true;
            },
            stopPropagation: function stopPropagation() {
                this.propagationStopped = true;
            }
        };

        function preventOriginalDefault() {
            this.originalEvent.preventDefault();
        }

        function getActionCursor(action) {
            var cursor = '';

            if (action.name === 'drag') {
                cursor = actionCursors.drag;
            }
            if (action.name === 'resize') {
                if (action.axis) {
                    cursor = actionCursors[action.name + action.axis];
                } else if (action.edges) {
                    var cursorKey = 'resize',
                        edgeNames = ['top', 'bottom', 'left', 'right'];

                    for (var i = 0; i < 4; i++) {
                        if (action.edges[edgeNames[i]]) {
                            cursorKey += edgeNames[i];
                        }
                    }

                    cursor = actionCursors[cursorKey];
                }
            }

            return cursor;
        }

        function checkResizeEdge(name, value, page, element, interactableElement, rect, margin) {
            if (!value) {
                return false;
            }

            if (value === true) {
                var width = isNumber(rect.width) ? rect.width : rect.right - rect.left,
                    height = isNumber(rect.height) ? rect.height : rect.bottom - rect.top;

                if (width < 0) {
                    if (name === 'left') {
                        name = 'right';
                    } else if (name === 'right') {
                        name = 'left';
                    }
                }
                if (height < 0) {
                    if (name === 'top') {
                        name = 'bottom';
                    } else if (name === 'bottom') {
                        name = 'top';
                    }
                }

                if (name === 'left') {
                    return page.x < (width >= 0 ? rect.left : rect.right) + margin;
                }
                if (name === 'top') {
                    return page.y < (height >= 0 ? rect.top : rect.bottom) + margin;
                }

                if (name === 'right') {
                    return page.x > (width >= 0 ? rect.right : rect.left) - margin;
                }
                if (name === 'bottom') {
                    return page.y > (height >= 0 ? rect.bottom : rect.top) - margin;
                }
            }

            if (!isElement(element)) {
                return false;
            }

            return isElement(value) ? value === element : matchesUpTo(element, value, interactableElement);
        }

        function defaultActionChecker(pointer, interaction, element) {
            var rect = this.getRect(element),
                shouldResize = false,
                action = null,
                resizeAxes = null,
                resizeEdges,
                page = extend({}, interaction.curCoords.page),
                options = this.options;

            if (!rect) {
                return null;
            }

            if (actionIsEnabled.resize && options.resize.enabled) {
                var resizeOptions = options.resize;

                resizeEdges = {
                    left: false, right: false, top: false, bottom: false
                };

                if (isObject(resizeOptions.edges)) {
                    for (var edge in resizeEdges) {
                        resizeEdges[edge] = checkResizeEdge(edge, resizeOptions.edges[edge], page, interaction._eventTarget, element, rect, resizeOptions.margin || margin);
                    }

                    resizeEdges.left = resizeEdges.left && !resizeEdges.right;
                    resizeEdges.top = resizeEdges.top && !resizeEdges.bottom;

                    shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
                } else {
                    var right = options.resize.axis !== 'y' && page.x > rect.right - margin,
                        bottom = options.resize.axis !== 'x' && page.y > rect.bottom - margin;

                    shouldResize = right || bottom;
                    resizeAxes = (right ? 'x' : '') + (bottom ? 'y' : '');
                }
            }

            action = shouldResize ? 'resize' : actionIsEnabled.drag && options.drag.enabled ? 'drag' : null;

            if (actionIsEnabled.gesture && interaction.pointerIds.length >= 2 && !(interaction.dragging || interaction.resizing)) {
                action = 'gesture';
            }

            if (action) {
                return {
                    name: action,
                    axis: resizeAxes,
                    edges: resizeEdges
                };
            }

            return null;
        }

        function validateAction(action, interactable) {
            if (!isObject(action)) {
                return null;
            }

            var actionName = action.name,
                options = interactable.options;

            if ((actionName === 'resize' && options.resize.enabled || actionName === 'drag' && options.drag.enabled || actionName === 'gesture' && options.gesture.enabled) && actionIsEnabled[actionName]) {

                if (actionName === 'resize' || actionName === 'resizeyx') {
                    actionName = 'resizexy';
                }

                return action;
            }
            return null;
        }

        var listeners = {},
            interactionListeners = ['dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove', 'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown', 'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd', 'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'];

        for (var i = 0, len = interactionListeners.length; i < len; i++) {
            var name = interactionListeners[i];

            listeners[name] = doOnInteractions(name);
        }

        function delegateListener(event, useCapture) {
            var fakeEvent = {},
                delegated = delegatedEvents[event.type],
                eventTarget = getActualElement(event.path ? event.path[0] : event.target),
                element = eventTarget;

            useCapture = useCapture ? true : false;

            for (var prop in event) {
                fakeEvent[prop] = event[prop];
            }

            fakeEvent.originalEvent = event;
            fakeEvent.preventDefault = preventOriginalDefault;

            while (isElement(element)) {
                for (var i = 0; i < delegated.selectors.length; i++) {
                    var selector = delegated.selectors[i],
                        context = delegated.contexts[i];

                    if (matchesSelector(element, selector) && nodeContains(context, eventTarget) && nodeContains(context, element)) {

                        var listeners = delegated.listeners[i];

                        fakeEvent.currentTarget = element;

                        for (var j = 0; j < listeners.length; j++) {
                            if (listeners[j][1] === useCapture) {
                                listeners[j][0](fakeEvent);
                            }
                        }
                    }
                }

                element = parentElement(element);
            }
        }

        function delegateUseCapture(event) {
            return delegateListener.call(this, event, true);
        }

        interactables.indexOfElement = function indexOfElement(element, context) {
            context = context || document;

            for (var i = 0; i < this.length; i++) {
                var interactable = this[i];

                if (interactable.selector === element && interactable._context === context || !interactable.selector && interactable._element === element) {

                    return i;
                }
            }
            return -1;
        };

        interactables.get = function interactableGet(element, options) {
            return this[this.indexOfElement(element, options && options.context)];
        };

        interactables.forEachSelector = function (callback) {
            for (var i = 0; i < this.length; i++) {
                var interactable = this[i];

                if (!interactable.selector) {
                    continue;
                }

                var ret = callback(interactable, interactable.selector, interactable._context, i, this);

                if (ret !== undefined) {
                    return ret;
                }
            }
        };

        function interact(element, options) {
            return interactables.get(element, options) || new Interactable(element, options);
        }

        function Interactable(element, options) {
            this._element = element;
            this._iEvents = this._iEvents || {};

            var _window;

            if (trySelector(element)) {
                this.selector = element;

                var context = options && options.context;

                _window = context ? getWindow(context) : window;

                if (context && (_window.Node ? context instanceof _window.Node : isElement(context) || context === _window.document)) {

                    this._context = context;
                }
            } else {
                _window = getWindow(element);

                if (isElement(element, _window)) {

                    if (PointerEvent) {
                        events.add(this._element, pEventTypes.down, listeners.pointerDown);
                        events.add(this._element, pEventTypes.move, listeners.pointerHover);
                    } else {
                        events.add(this._element, 'mousedown', listeners.pointerDown);
                        events.add(this._element, 'mousemove', listeners.pointerHover);
                        events.add(this._element, 'touchstart', listeners.pointerDown);
                        events.add(this._element, 'touchmove', listeners.pointerHover);
                    }
                }
            }

            this._doc = _window.document;

            if (!contains(documents, this._doc)) {
                listenToDocument(this._doc);
            }

            interactables.push(this);

            this.set(options);
        }

        Interactable.prototype = {
            setOnEvents: function setOnEvents(action, phases) {
                if (action === 'drop') {
                    if (isFunction(phases.ondrop)) {
                        this.ondrop = phases.ondrop;
                    }
                    if (isFunction(phases.ondropactivate)) {
                        this.ondropactivate = phases.ondropactivate;
                    }
                    if (isFunction(phases.ondropdeactivate)) {
                        this.ondropdeactivate = phases.ondropdeactivate;
                    }
                    if (isFunction(phases.ondragenter)) {
                        this.ondragenter = phases.ondragenter;
                    }
                    if (isFunction(phases.ondragleave)) {
                        this.ondragleave = phases.ondragleave;
                    }
                    if (isFunction(phases.ondropmove)) {
                        this.ondropmove = phases.ondropmove;
                    }
                } else {
                    action = 'on' + action;

                    if (isFunction(phases.onstart)) {
                        this[action + 'start'] = phases.onstart;
                    }
                    if (isFunction(phases.onmove)) {
                        this[action + 'move'] = phases.onmove;
                    }
                    if (isFunction(phases.onend)) {
                        this[action + 'end'] = phases.onend;
                    }
                    if (isFunction(phases.oninertiastart)) {
                        this[action + 'inertiastart'] = phases.oninertiastart;
                    }
                }

                return this;
            },

            draggable: function draggable(options) {
                if (isObject(options)) {
                    this.options.drag.enabled = options.enabled === false ? false : true;
                    this.setPerAction('drag', options);
                    this.setOnEvents('drag', options);

                    if (/^x$|^y$|^xy$/.test(options.axis)) {
                        this.options.drag.axis = options.axis;
                    } else if (options.axis === null) {
                        delete this.options.drag.axis;
                    }

                    return this;
                }

                if (isBool(options)) {
                    this.options.drag.enabled = options;

                    return this;
                }

                return this.options.drag;
            },

            setPerAction: function setPerAction(action, options) {
                for (var option in options) {
                    if (option in defaultOptions[action]) {
                        if (isObject(options[option])) {
                            this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

                            if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
                                this.options[action][option].enabled = options[option].enabled === false ? false : true;
                            }
                        } else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
                            this.options[action][option].enabled = options[option];
                        } else if (options[option] !== undefined) {
                            this.options[action][option] = options[option];
                        }
                    }
                }
            },

            dropzone: function dropzone(options) {
                if (isObject(options)) {
                    this.options.drop.enabled = options.enabled === false ? false : true;
                    this.setOnEvents('drop', options);

                    if (/^(pointer|center)$/.test(options.overlap)) {
                        this.options.drop.overlap = options.overlap;
                    } else if (isNumber(options.overlap)) {
                        this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
                    }
                    if ('accept' in options) {
                        this.options.drop.accept = options.accept;
                    }
                    if ('checker' in options) {
                        this.options.drop.checker = options.checker;
                    }

                    return this;
                }

                if (isBool(options)) {
                    this.options.drop.enabled = options;

                    return this;
                }

                return this.options.drop;
            },

            dropCheck: function dropCheck(dragEvent, event, draggable, draggableElement, dropElement, rect) {
                var dropped = false;

                if (!(rect = rect || this.getRect(dropElement))) {
                    return this.options.drop.checker ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement) : false;
                }

                var dropOverlap = this.options.drop.overlap;

                if (dropOverlap === 'pointer') {
                    var page = _getPageXY(dragEvent),
                        origin = getOriginXY(draggable, draggableElement),
                        horizontal,
                        vertical;

                    page.x += origin.x;
                    page.y += origin.y;

                    horizontal = page.x > rect.left && page.x < rect.right;
                    vertical = page.y > rect.top && page.y < rect.bottom;

                    dropped = horizontal && vertical;
                }

                var dragRect = draggable.getRect(draggableElement);

                if (dropOverlap === 'center') {
                    var cx = dragRect.left + dragRect.width / 2,
                        cy = dragRect.top + dragRect.height / 2;

                    dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
                }

                if (isNumber(dropOverlap)) {
                    var overlapArea = Math.max(0, Math.min(rect.right, dragRect.right) - Math.max(rect.left, dragRect.left)) * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top, dragRect.top)),
                        overlapRatio = overlapArea / (dragRect.width * dragRect.height);

                    dropped = overlapRatio >= dropOverlap;
                }

                if (this.options.drop.checker) {
                    dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
                }

                return dropped;
            },

            dropChecker: function dropChecker(checker) {
                if (isFunction(checker)) {
                    this.options.drop.checker = checker;

                    return this;
                }
                if (checker === null) {
                    delete this.options.getRect;

                    return this;
                }

                return this.options.drop.checker;
            },

            accept: function accept(newValue) {
                if (isElement(newValue)) {
                    this.options.drop.accept = newValue;

                    return this;
                }

                if (trySelector(newValue)) {
                    this.options.drop.accept = newValue;

                    return this;
                }

                if (newValue === null) {
                    delete this.options.drop.accept;

                    return this;
                }

                return this.options.drop.accept;
            },

            resizable: function resizable(options) {
                if (isObject(options)) {
                    this.options.resize.enabled = options.enabled === false ? false : true;
                    this.setPerAction('resize', options);
                    this.setOnEvents('resize', options);

                    if (/^x$|^y$|^xy$/.test(options.axis)) {
                        this.options.resize.axis = options.axis;
                    } else if (options.axis === null) {
                        this.options.resize.axis = defaultOptions.resize.axis;
                    }

                    if (isBool(options.preserveAspectRatio)) {
                        this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
                    } else if (isBool(options.square)) {
                        this.options.resize.square = options.square;
                    }

                    return this;
                }
                if (isBool(options)) {
                    this.options.resize.enabled = options;

                    return this;
                }
                return this.options.resize;
            },

            squareResize: function squareResize(newValue) {
                if (isBool(newValue)) {
                    this.options.resize.square = newValue;

                    return this;
                }

                if (newValue === null) {
                    delete this.options.resize.square;

                    return this;
                }

                return this.options.resize.square;
            },

            gesturable: function gesturable(options) {
                if (isObject(options)) {
                    this.options.gesture.enabled = options.enabled === false ? false : true;
                    this.setPerAction('gesture', options);
                    this.setOnEvents('gesture', options);

                    return this;
                }

                if (isBool(options)) {
                    this.options.gesture.enabled = options;

                    return this;
                }

                return this.options.gesture;
            },

            autoScroll: function autoScroll(options) {
                if (isObject(options)) {
                    options = extend({ actions: ['drag', 'resize'] }, options);
                } else if (isBool(options)) {
                    options = { actions: ['drag', 'resize'], enabled: options };
                }

                return this.setOptions('autoScroll', options);
            },

            snap: function snap(options) {
                var ret = this.setOptions('snap', options);

                if (ret === this) {
                    return this;
                }

                return ret.drag;
            },

            setOptions: function setOptions(option, options) {
                var actions = options && isArray(options.actions) ? options.actions : ['drag'];

                var i;

                if (isObject(options) || isBool(options)) {
                    for (i = 0; i < actions.length; i++) {
                        var action = /resize/.test(actions[i]) ? 'resize' : actions[i];

                        if (!isObject(this.options[action])) {
                            continue;
                        }

                        var thisOption = this.options[action][option];

                        if (isObject(options)) {
                            extend(thisOption, options);
                            thisOption.enabled = options.enabled === false ? false : true;

                            if (option === 'snap') {
                                if (thisOption.mode === 'grid') {
                                    thisOption.targets = [interact.createSnapGrid(extend({
                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
                                    }, thisOption.grid || {}))];
                                } else if (thisOption.mode === 'anchor') {
                                    thisOption.targets = thisOption.anchors;
                                } else if (thisOption.mode === 'path') {
                                    thisOption.targets = thisOption.paths;
                                }

                                if ('elementOrigin' in options) {
                                    thisOption.relativePoints = [options.elementOrigin];
                                }
                            }
                        } else if (isBool(options)) {
                            thisOption.enabled = options;
                        }
                    }

                    return this;
                }

                var ret = {},
                    allActions = ['drag', 'resize', 'gesture'];

                for (i = 0; i < allActions.length; i++) {
                    if (option in defaultOptions[allActions[i]]) {
                        ret[allActions[i]] = this.options[allActions[i]][option];
                    }
                }

                return ret;
            },

            inertia: function inertia(options) {
                var ret = this.setOptions('inertia', options);

                if (ret === this) {
                    return this;
                }

                return ret.drag;
            },

            getAction: function getAction(pointer, event, interaction, element) {
                var action = this.defaultActionChecker(pointer, interaction, element);

                if (this.options.actionChecker) {
                    return this.options.actionChecker(pointer, event, action, this, element, interaction);
                }

                return action;
            },

            defaultActionChecker: defaultActionChecker,

            actionChecker: function actionChecker(checker) {
                if (isFunction(checker)) {
                    this.options.actionChecker = checker;

                    return this;
                }

                if (checker === null) {
                    delete this.options.actionChecker;

                    return this;
                }

                return this.options.actionChecker;
            },

            getRect: function rectCheck(element) {
                element = element || this._element;

                if (this.selector && !isElement(element)) {
                    element = this._context.querySelector(this.selector);
                }

                return getElementRect(element);
            },

            rectChecker: function rectChecker(checker) {
                if (isFunction(checker)) {
                    this.getRect = checker;

                    return this;
                }

                if (checker === null) {
                    delete this.options.getRect;

                    return this;
                }

                return this.getRect;
            },

            styleCursor: function styleCursor(newValue) {
                if (isBool(newValue)) {
                    this.options.styleCursor = newValue;

                    return this;
                }

                if (newValue === null) {
                    delete this.options.styleCursor;

                    return this;
                }

                return this.options.styleCursor;
            },

            preventDefault: function preventDefault(newValue) {
                if (/^(always|never|auto)$/.test(newValue)) {
                    this.options.preventDefault = newValue;
                    return this;
                }

                if (isBool(newValue)) {
                    this.options.preventDefault = newValue ? 'always' : 'never';
                    return this;
                }

                return this.options.preventDefault;
            },

            origin: function origin(newValue) {
                if (trySelector(newValue)) {
                    this.options.origin = newValue;
                    return this;
                } else if (isObject(newValue)) {
                    this.options.origin = newValue;
                    return this;
                }

                return this.options.origin;
            },

            deltaSource: function deltaSource(newValue) {
                if (newValue === 'page' || newValue === 'client') {
                    this.options.deltaSource = newValue;

                    return this;
                }

                return this.options.deltaSource;
            },

            restrict: function restrict(options) {
                if (!isObject(options)) {
                    return this.setOptions('restrict', options);
                }

                var actions = ['drag', 'resize', 'gesture'],
                    ret;

                for (var i = 0; i < actions.length; i++) {
                    var action = actions[i];

                    if (action in options) {
                        var perAction = extend({
                            actions: [action],
                            restriction: options[action]
                        }, options);

                        ret = this.setOptions('restrict', perAction);
                    }
                }

                return ret;
            },

            context: function context() {
                return this._context;
            },

            _context: document,

            ignoreFrom: function ignoreFrom(newValue) {
                if (trySelector(newValue)) {
                    this.options.ignoreFrom = newValue;
                    return this;
                }

                if (isElement(newValue)) {
                    this.options.ignoreFrom = newValue;
                    return this;
                }

                return this.options.ignoreFrom;
            },

            allowFrom: function allowFrom(newValue) {
                if (trySelector(newValue)) {
                    this.options.allowFrom = newValue;
                    return this;
                }

                if (isElement(newValue)) {
                    this.options.allowFrom = newValue;
                    return this;
                }

                return this.options.allowFrom;
            },

            element: function element() {
                return this._element;
            },

            fire: function fire(iEvent) {
                if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
                    return this;
                }

                var listeners,
                    i,
                    len,
                    onEvent = 'on' + iEvent.type,
                    funcName = '';

                if (iEvent.type in this._iEvents) {
                    listeners = this._iEvents[iEvent.type];

                    for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                        funcName = listeners[i].name;
                        listeners[i](iEvent);
                    }
                }

                if (isFunction(this[onEvent])) {
                    funcName = this[onEvent].name;
                    this[onEvent](iEvent);
                }

                if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type])) {

                    for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                        funcName = listeners[i].name;
                        listeners[i](iEvent);
                    }
                }

                return this;
            },

            on: function on(eventType, listener, useCapture) {
                var i;

                if (isString(eventType) && eventType.search(' ') !== -1) {
                    eventType = eventType.trim().split(/ +/);
                }

                if (isArray(eventType)) {
                    for (i = 0; i < eventType.length; i++) {
                        this.on(eventType[i], listener, useCapture);
                    }

                    return this;
                }

                if (isObject(eventType)) {
                    for (var prop in eventType) {
                        this.on(prop, eventType[prop], listener);
                    }

                    return this;
                }

                if (eventType === 'wheel') {
                    eventType = wheelEvent;
                }

                useCapture = useCapture ? true : false;

                if (contains(eventTypes, eventType)) {
                    if (!(eventType in this._iEvents)) {
                        this._iEvents[eventType] = [listener];
                    } else {
                        this._iEvents[eventType].push(listener);
                    }
                } else if (this.selector) {
                        if (!delegatedEvents[eventType]) {
                            delegatedEvents[eventType] = {
                                selectors: [],
                                contexts: [],
                                listeners: []
                            };

                            for (i = 0; i < documents.length; i++) {
                                events.add(documents[i], eventType, delegateListener);
                                events.add(documents[i], eventType, delegateUseCapture, true);
                            }
                        }

                        var delegated = delegatedEvents[eventType],
                            index;

                        for (index = delegated.selectors.length - 1; index >= 0; index--) {
                            if (delegated.selectors[index] === this.selector && delegated.contexts[index] === this._context) {
                                break;
                            }
                        }

                        if (index === -1) {
                            index = delegated.selectors.length;

                            delegated.selectors.push(this.selector);
                            delegated.contexts.push(this._context);
                            delegated.listeners.push([]);
                        }

                        delegated.listeners[index].push([listener, useCapture]);
                    } else {
                        events.add(this._element, eventType, listener, useCapture);
                    }

                return this;
            },

            off: function off(eventType, listener, useCapture) {
                var i;

                if (isString(eventType) && eventType.search(' ') !== -1) {
                    eventType = eventType.trim().split(/ +/);
                }

                if (isArray(eventType)) {
                    for (i = 0; i < eventType.length; i++) {
                        this.off(eventType[i], listener, useCapture);
                    }

                    return this;
                }

                if (isObject(eventType)) {
                    for (var prop in eventType) {
                        this.off(prop, eventType[prop], listener);
                    }

                    return this;
                }

                var eventList,
                    index = -1;

                useCapture = useCapture ? true : false;

                if (eventType === 'wheel') {
                    eventType = wheelEvent;
                }

                if (contains(eventTypes, eventType)) {
                    eventList = this._iEvents[eventType];

                    if (eventList && (index = indexOf(eventList, listener)) !== -1) {
                        this._iEvents[eventType].splice(index, 1);
                    }
                } else if (this.selector) {
                        var delegated = delegatedEvents[eventType],
                            matchFound = false;

                        if (!delegated) {
                            return this;
                        }

                        for (index = delegated.selectors.length - 1; index >= 0; index--) {
                            if (delegated.selectors[index] === this.selector && delegated.contexts[index] === this._context) {

                                var listeners = delegated.listeners[index];

                                for (i = listeners.length - 1; i >= 0; i--) {
                                    var fn = listeners[i][0],
                                        useCap = listeners[i][1];

                                    if (fn === listener && useCap === useCapture) {
                                        listeners.splice(i, 1);

                                        if (!listeners.length) {
                                            delegated.selectors.splice(index, 1);
                                            delegated.contexts.splice(index, 1);
                                            delegated.listeners.splice(index, 1);

                                            events.remove(this._context, eventType, delegateListener);
                                            events.remove(this._context, eventType, delegateUseCapture, true);

                                            if (!delegated.selectors.length) {
                                                delegatedEvents[eventType] = null;
                                            }
                                        }

                                        matchFound = true;
                                        break;
                                    }
                                }

                                if (matchFound) {
                                    break;
                                }
                            }
                        }
                    } else {
                            events.remove(this._element, eventType, listener, useCapture);
                        }

                return this;
            },

            set: function set(options) {
                if (!isObject(options)) {
                    options = {};
                }

                this.options = extend({}, defaultOptions.base);

                var i,
                    actions = ['drag', 'drop', 'resize', 'gesture'],
                    methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
                    perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

                for (i = 0; i < actions.length; i++) {
                    var action = actions[i];

                    this.options[action] = extend({}, defaultOptions[action]);

                    this.setPerAction(action, perActions);

                    this[methods[i]](options[action]);
                }

                var settings = ['accept', 'actionChecker', 'allowFrom', 'deltaSource', 'dropChecker', 'ignoreFrom', 'origin', 'preventDefault', 'rectChecker', 'styleCursor'];

                for (i = 0, len = settings.length; i < len; i++) {
                    var setting = settings[i];

                    this.options[setting] = defaultOptions.base[setting];

                    if (setting in options) {
                        this[setting](options[setting]);
                    }
                }

                return this;
            },

            unset: function unset() {
                events.remove(this._element, 'all');

                if (!isString(this.selector)) {
                    events.remove(this, 'all');
                    if (this.options.styleCursor) {
                        this._element.style.cursor = '';
                    }
                } else {
                    for (var type in delegatedEvents) {
                        var delegated = delegatedEvents[type];

                        for (var i = 0; i < delegated.selectors.length; i++) {
                            if (delegated.selectors[i] === this.selector && delegated.contexts[i] === this._context) {

                                delegated.selectors.splice(i, 1);
                                delegated.contexts.splice(i, 1);
                                delegated.listeners.splice(i, 1);

                                if (!delegated.selectors.length) {
                                    delegatedEvents[type] = null;
                                }
                            }

                            events.remove(this._context, type, delegateListener);
                            events.remove(this._context, type, delegateUseCapture, true);

                            break;
                        }
                    }
                }

                this.dropzone(false);

                interactables.splice(indexOf(interactables, this), 1);

                return interact;
            }
        };

        function warnOnce(method, message) {
            var warned = false;

            return function () {
                if (!warned) {
                    window.console.warn(message);
                    warned = true;
                }

                return method.apply(this, arguments);
            };
        }

        Interactable.prototype.snap = warnOnce(Interactable.prototype.snap, 'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
        Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict, 'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
        Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia, 'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
        Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll, 'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
        Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize, 'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');

        Interactable.prototype.accept = warnOnce(Interactable.prototype.accept, 'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
        Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker, 'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
        Interactable.prototype.context = warnOnce(Interactable.prototype.context, 'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');

        interact.isSet = function (element, options) {
            return interactables.indexOfElement(element, options && options.context) !== -1;
        };

        interact.on = function (type, listener, useCapture) {
            if (isString(type) && type.search(' ') !== -1) {
                type = type.trim().split(/ +/);
            }

            if (isArray(type)) {
                for (var i = 0; i < type.length; i++) {
                    interact.on(type[i], listener, useCapture);
                }

                return interact;
            }

            if (isObject(type)) {
                for (var prop in type) {
                    interact.on(prop, type[prop], listener);
                }

                return interact;
            }

            if (contains(eventTypes, type)) {
                if (!globalEvents[type]) {
                    globalEvents[type] = [listener];
                } else {
                    globalEvents[type].push(listener);
                }
            } else {
                    events.add(document, type, listener, useCapture);
                }

            return interact;
        };

        interact.off = function (type, listener, useCapture) {
            if (isString(type) && type.search(' ') !== -1) {
                type = type.trim().split(/ +/);
            }

            if (isArray(type)) {
                for (var i = 0; i < type.length; i++) {
                    interact.off(type[i], listener, useCapture);
                }

                return interact;
            }

            if (isObject(type)) {
                for (var prop in type) {
                    interact.off(prop, type[prop], listener);
                }

                return interact;
            }

            if (!contains(eventTypes, type)) {
                events.remove(document, type, listener, useCapture);
            } else {
                var index;

                if (type in globalEvents && (index = indexOf(globalEvents[type], listener)) !== -1) {
                    globalEvents[type].splice(index, 1);
                }
            }

            return interact;
        };

        interact.enableDragging = warnOnce(function (newValue) {
            if (newValue !== null && newValue !== undefined) {
                actionIsEnabled.drag = newValue;

                return interact;
            }
            return actionIsEnabled.drag;
        }, 'interact.enableDragging is deprecated and will soon be removed.');

        interact.enableResizing = warnOnce(function (newValue) {
            if (newValue !== null && newValue !== undefined) {
                actionIsEnabled.resize = newValue;

                return interact;
            }
            return actionIsEnabled.resize;
        }, 'interact.enableResizing is deprecated and will soon be removed.');

        interact.enableGesturing = warnOnce(function (newValue) {
            if (newValue !== null && newValue !== undefined) {
                actionIsEnabled.gesture = newValue;

                return interact;
            }
            return actionIsEnabled.gesture;
        }, 'interact.enableGesturing is deprecated and will soon be removed.');

        interact.eventTypes = eventTypes;

        interact.debug = function () {
            var interaction = interactions[0] || new Interaction();

            return {
                interactions: interactions,
                target: interaction.target,
                dragging: interaction.dragging,
                resizing: interaction.resizing,
                gesturing: interaction.gesturing,
                prepared: interaction.prepared,
                matches: interaction.matches,
                matchElements: interaction.matchElements,

                prevCoords: interaction.prevCoords,
                startCoords: interaction.startCoords,

                pointerIds: interaction.pointerIds,
                pointers: interaction.pointers,
                addPointer: listeners.addPointer,
                removePointer: listeners.removePointer,
                recordPointer: listeners.recordPointer,

                snap: interaction.snapStatus,
                restrict: interaction.restrictStatus,
                inertia: interaction.inertiaStatus,

                downTime: interaction.downTimes[0],
                downEvent: interaction.downEvent,
                downPointer: interaction.downPointer,
                prevEvent: interaction.prevEvent,

                Interactable: Interactable,
                interactables: interactables,
                pointerIsDown: interaction.pointerIsDown,
                defaultOptions: defaultOptions,
                defaultActionChecker: defaultActionChecker,

                actionCursors: actionCursors,
                dragMove: listeners.dragMove,
                resizeMove: listeners.resizeMove,
                gestureMove: listeners.gestureMove,
                pointerUp: listeners.pointerUp,
                pointerDown: listeners.pointerDown,
                pointerMove: listeners.pointerMove,
                pointerHover: listeners.pointerHover,

                eventTypes: eventTypes,

                events: events,
                globalEvents: globalEvents,
                delegatedEvents: delegatedEvents,

                prefixedPropREs: prefixedPropREs
            };
        };

        interact.getPointerAverage = pointerAverage;
        interact.getTouchBBox = touchBBox;
        interact.getTouchDistance = touchDistance;
        interact.getTouchAngle = touchAngle;

        interact.getElementRect = getElementRect;
        interact.getElementClientRect = getElementClientRect;
        interact.matchesSelector = matchesSelector;
        interact.closest = closest;

        interact.margin = warnOnce(function (newvalue) {
            if (isNumber(newvalue)) {
                margin = newvalue;

                return interact;
            }
            return margin;
        }, 'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.');

        interact.supportsTouch = function () {
            return supportsTouch;
        };

        interact.supportsPointerEvent = function () {
            return supportsPointerEvent;
        };

        interact.stop = function (event) {
            for (var i = interactions.length - 1; i >= 0; i--) {
                interactions[i].stop(event);
            }

            return interact;
        };

        interact.dynamicDrop = function (newValue) {
            if (isBool(newValue)) {

                dynamicDrop = newValue;

                return interact;
            }
            return dynamicDrop;
        };

        interact.pointerMoveTolerance = function (newValue) {
            if (isNumber(newValue)) {
                pointerMoveTolerance = newValue;

                return this;
            }

            return pointerMoveTolerance;
        };

        interact.maxInteractions = function (newValue) {
            if (isNumber(newValue)) {
                maxInteractions = newValue;

                return this;
            }

            return maxInteractions;
        };

        interact.createSnapGrid = function (grid) {
            return function (x, y) {
                var offsetX = 0,
                    offsetY = 0;

                if (isObject(grid.offset)) {
                    offsetX = grid.offset.x;
                    offsetY = grid.offset.y;
                }

                var gridx = Math.round((x - offsetX) / grid.x),
                    gridy = Math.round((y - offsetY) / grid.y),
                    newX = gridx * grid.x + offsetX,
                    newY = gridy * grid.y + offsetY;

                return {
                    x: newX,
                    y: newY,
                    range: grid.range
                };
            };
        };

        function endAllInteractions(event) {
            for (var i = 0; i < interactions.length; i++) {
                interactions[i].pointerEnd(event, event);
            }
        }

        function listenToDocument(doc) {
            if (contains(documents, doc)) {
                return;
            }

            var win = doc.defaultView || doc.parentWindow;

            for (var eventType in delegatedEvents) {
                events.add(doc, eventType, delegateListener);
                events.add(doc, eventType, delegateUseCapture, true);
            }

            if (PointerEvent) {
                if (PointerEvent === win.MSPointerEvent) {
                    pEventTypes = {
                        up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
                        out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
                } else {
                    pEventTypes = {
                        up: 'pointerup', down: 'pointerdown', over: 'pointerover',
                        out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
                }

                events.add(doc, pEventTypes.down, listeners.selectorDown);
                events.add(doc, pEventTypes.move, listeners.pointerMove);
                events.add(doc, pEventTypes.over, listeners.pointerOver);
                events.add(doc, pEventTypes.out, listeners.pointerOut);
                events.add(doc, pEventTypes.up, listeners.pointerUp);
                events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

                events.add(doc, pEventTypes.move, listeners.autoScrollMove);
            } else {
                events.add(doc, 'mousedown', listeners.selectorDown);
                events.add(doc, 'mousemove', listeners.pointerMove);
                events.add(doc, 'mouseup', listeners.pointerUp);
                events.add(doc, 'mouseover', listeners.pointerOver);
                events.add(doc, 'mouseout', listeners.pointerOut);

                events.add(doc, 'touchstart', listeners.selectorDown);
                events.add(doc, 'touchmove', listeners.pointerMove);
                events.add(doc, 'touchend', listeners.pointerUp);
                events.add(doc, 'touchcancel', listeners.pointerCancel);

                events.add(doc, 'mousemove', listeners.autoScrollMove);
                events.add(doc, 'touchmove', listeners.autoScrollMove);
            }

            events.add(win, 'blur', endAllInteractions);

            try {
                if (win.frameElement) {
                    var parentDoc = win.frameElement.ownerDocument,
                        parentWindow = parentDoc.defaultView;

                    events.add(parentDoc, 'mouseup', listeners.pointerEnd);
                    events.add(parentDoc, 'touchend', listeners.pointerEnd);
                    events.add(parentDoc, 'touchcancel', listeners.pointerEnd);
                    events.add(parentDoc, 'pointerup', listeners.pointerEnd);
                    events.add(parentDoc, 'MSPointerUp', listeners.pointerEnd);
                    events.add(parentWindow, 'blur', endAllInteractions);
                }
            } catch (error) {
                interact.windowParentError = error;
            }

            events.add(doc, 'dragstart', function (event) {
                for (var i = 0; i < interactions.length; i++) {
                    var interaction = interactions[i];

                    if (interaction.element && (interaction.element === event.target || nodeContains(interaction.element, event.target))) {

                        interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
                        return;
                    }
                }
            });

            if (events.useAttachEvent) {
                events.add(doc, 'selectstart', function (event) {
                    var interaction = interactions[0];

                    if (interaction.currentAction()) {
                        interaction.checkAndPreventDefault(event);
                    }
                });

                events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
            }

            documents.push(doc);
        }

        listenToDocument(document);

        function indexOf(array, target) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === target) {
                    return i;
                }
            }

            return -1;
        }

        function contains(array, target) {
            return indexOf(array, target) !== -1;
        }

        function matchesSelector(element, selector, nodeList) {
            if (ie8MatchesSelector) {
                return ie8MatchesSelector(element, selector, nodeList);
            }

            if (window !== realWindow) {
                selector = selector.replace(/\/deep\//g, ' ');
            }

            return element[prefixedMatchesSelector](selector);
        }

        function matchesUpTo(element, selector, limit) {
            while (isElement(element)) {
                if (matchesSelector(element, selector)) {
                    return true;
                }

                element = parentElement(element);

                if (element === limit) {
                    return matchesSelector(element, selector);
                }
            }

            return false;
        }

        if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
            ie8MatchesSelector = function ie8MatchesSelector(element, selector, elems) {
                elems = elems || element.parentNode.querySelectorAll(selector);

                for (var i = 0, len = elems.length; i < len; i++) {
                    if (elems[i] === element) {
                        return true;
                    }
                }

                return false;
            };
        }

        (function () {
            var lastTime = 0,
                vendors = ['ms', 'moz', 'webkit', 'o'];

            for (var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
                reqFrame = realWindow[vendors[x] + 'RequestAnimationFrame'];
                cancelFrame = realWindow[vendors[x] + 'CancelAnimationFrame'] || realWindow[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!reqFrame) {
                reqFrame = function reqFrame(callback) {
                    var currTime = new Date().getTime(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!cancelFrame) {
                cancelFrame = function cancelFrame(id) {
                    clearTimeout(id);
                };
            }
        })();

        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = interact;
            }
            exports.interact = interact;
        } else if (typeof define === 'function' && define.amd) {
                define('interact', [],function () {
                    return interact;
                });
            } else {
                realWindow.interact = interact;
            }
    })(typeof window === 'undefined' ? undefined : window);
});
define('components/picture/picture-test',['exports', 'aurelia-framework', '../../services/picture-service', './interact'], function (exports, _aureliaFramework, _pictureService, _interact) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PictureTest = undefined;

    var interact = _interopRequireWildcard(_interact);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PictureTest = exports.PictureTest = (_dec = (0, _aureliaFramework.inject)(_pictureService.PictureService), _dec(_class = function () {
        function PictureTest(pictureService) {
            _classCallCheck(this, PictureTest);

            this.pictureUrl = '';
            this.isLoaded = false;

            this.pictureService = pictureService;
        }

        PictureTest.prototype.created = function created() {
            console.log(interact.interact);
            interact.interact('#dragTest').draggable({
                inertia: true,

                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { top: -0.1, left: -0.1, bottom: 1.1, right: 1.1 }
                },

                autoScroll: true,

                onmove: this.dragMoveListener,

                onend: function onend(event) {
                    var textEl = event.target.querySelector('p');
                    textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
                }
            }).resizable({
                preserveAspectRatio: true,
                edges: { left: true, right: true, bottom: true, top: true }
            }).on('resizemove', function (event) {
                var target = event.target,
                    x = parseFloat(target.getAttribute('data-x')) || 0,
                    y = parseFloat(target.getAttribute('data-y')) || 0;

                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
            });
        };

        PictureTest.prototype.test = function test() {
            var _this = this;

            this.pictureService.getPicture('testFrame', false).then(function (success) {
                console.log('SUCCESS');
                console.log(success);
                var response = JSON.parse(success.response);
                _this.pictureUrl = response.imageUrl;
                _this.isLoaded = true;
            }, function (failure) {
                console.log('FAILURE');
                console.log(failure);
            });
        };

        PictureTest.prototype.dragMoveListener = function dragMoveListener(event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        };

        return PictureTest;
    }()) || _class);
});
define('components/picture/picture-upload',['exports', 'aurelia-framework', '../../services/picture-service'], function (exports, _aureliaFramework, _pictureService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PictureUpload = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PictureUpload = exports.PictureUpload = (_dec = (0, _aureliaFramework.inject)(_pictureService.PictureService), _dec(_class = function () {
        function PictureUpload(pictureService) {
            _classCallCheck(this, PictureUpload);

            this.pictureService = pictureService;
        }

        PictureUpload.prototype.doUpload = function doUpload() {
            this.pictureService.putPicture('test-file-upload', this.selectedFiles[0], 'png').then(function (success) {
                console.log(success);
            }, function (failure) {
                console.log(failure);
            });
        };

        PictureUpload.prototype.clearFiles = function clearFiles() {
            document.getElementById("files").value = "";
        };

        return PictureUpload;
    }()) || _class);
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
define('components/user/user-login',['exports', 'aurelia-framework', 'aurelia-validation', '../../services/session-service'], function (exports, _aureliaFramework, _aureliaValidation, _sessionService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserLogin = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserLogin = exports.UserLogin = (_dec = (0, _aureliaFramework.inject)(_sessionService.SessionService, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function UserLogin(sessionService, validationController) {
            _classCallCheck(this, UserLogin);

            this.email = '';
            this.password = '';

            this.sessionService = sessionService;
            this.validationController = validationController;
            this.isWorking = false;
            this.success = false;
            this.serverError = {};
        }

        UserLogin.prototype.created = function created() {
            this.validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;

            _aureliaValidation.ValidationRules.ensure("email").email().required().withMessage("Por favor ingrese un email.").ensure("password").required().withMessage("Por favor ingrese la contraseña.").on(this);
        };

        UserLogin.prototype.login = function login() {
            this.success = false;
            this.isWorking = true;

            var userCredentials = {
                email: this.email,
                password: this.password
            };

            this.sessionService.login(userCredentials).then(function (success) {
                console.log("LOGIN SUCCESS");
                console.log(success);
            }, function (failue) {
                console.log("LOGIN FAIL");
                console.log(failure);
            });
        };

        return UserLogin;
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
define('layouts/main/login-modal',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var LoginModal = exports.LoginModal = function LoginModal() {
        _classCallCheck(this, LoginModal);
    };
});
define('layouts/main/nav-bar',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var NavBar = exports.NavBar = function NavBar() {
        _classCallCheck(this, NavBar);
    };
});
define('layouts/main/registration-modal',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RegistrationModal = exports.RegistrationModal = function RegistrationModal() {
        _classCallCheck(this, RegistrationModal);
    };
});
define('components/callback',['exports', 'aurelia-framework', '../services/auth-service'], function (exports, _aureliaFramework, _authService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Callback = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Callback = exports.Callback = (_dec = (0, _aureliaFramework.inject)(_authService.AuthService), _dec(_class = function Callback(AuthService) {
    _classCallCheck(this, Callback);

    this.auth = AuthService;
    this.auth.handleAuthentication();
  }) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./layouts/main/nav-bar\"></require><nav-bar></nav-bar><button type=\"button\" click.delegate=\"login()\">login</button> <button type=\"button\" click.delegate=\"logout()\">logout</button><router-view class=\"container\"></router-view></template>"; });
define('text!layouts/frame-admin-panel-layout.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/frame/frame-list\"></require><frame-list></frame-list><div class=\"row\"><div class=\"col-md-4 col-md-offset-4\"><div class=\"panel panel-default\"><div class=\"panel-heading\">Crear Marco</div><div class=\"panel-body\"><require from=\"../components/frame/frame-upload-form\"></require><frame-upload-form></frame-upload-form></div></div></div></div></template>"; });
define('text!components/frame/frame-detail-modal.html', ['module'], function(module) { module.exports = "<template><div class=\"modal fade bs-example-modal-lg\" id=\"frameDetailModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"frameDetailModal\"><div class=\"modal-dialog modal-lg\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\" id=\"myModalLabel\">Detalles - ${frame.uniqueName}</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-md-12\"><img src=\"${frame.picture.imageUrl}\" class=\"col-md-12\"></div></div><hr><div class=\"row\"><div class=\"col-md-6\"><require from=\"./frame-update-data-form\"></require><frame-update-data-form frame.bind=\"frame\"></frame-update-data-form></div></div></div><div class=\"modal-footer\"></div></div></div></div></template>"; });
define('text!components/frame/frame-gallery.html', ['module'], function(module) { module.exports = "<template><require from=\"./frame-thumbnail\"></require><div class=\"row\"><div class=\"alert alert-danger\" if.bind=\"error.description\"><strong>${error.title}</strong> ${error.description}</div></div><div repeat.for=\"row of frameRows\"><div class=\"row\"><div repeat.for=\"column of framesPerRow\"><div class=\"col-md-${12/framesPerRow}\"><frame-thumbnail frame.bind=\"frames[$parent.index * framesPerRow + $index]\"></frame-thumbnail></div></div></div></div>\\</template>"; });
define('text!components/frame/frame-list.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col-md-8 col-md-offset-2\"><div class=\"alert alert-danger\" if.bind=\"error.description\"><strong>${error.title}</strong> ${error.description}</div></div></div><div class=\"row\"><div class=\"col-md-10 col-md-offset-1\"><table class=\"table table-bordered\" if.bind=\"frames\"><tr><th>ID</th><th>Nombre unico</th><th>Nombre</th><th>Descripcion</th><th>Alto</th><th>Ancho</th><th>Imagen (nombre unico)</th><th>Precio</th><th>Acciones</th></tr><tr repeat.for=\"frame of frames\"><td>${frame.id}</td><td>${frame.uniqueName}</td><td>${frame.name}</td><td>${frame.description}</td><td>${frame.height}</td><td>${frame.length}</td><td>${frame.picture.imageKey}</td><td>${frame.price}</td><td><button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#frameDetailModal\" click.delegate=\"showDetails(frame.id)\"><i class=\"fa fa-info\" aria-hidden=\"true\"></i> Detalles</button> <button type=\"button\" class=\"btn btn-danger\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i> Eliminar</button></td></tr></table></div></div><require from=\"./frame-detail-modal\"></require><frame-detail-modal view-model.ref=\"frameDetailsViewModel\"></frame-detail-modal></template>"; });
define('text!components/frame/frame-thumbnail.html', ['module'], function(module) { module.exports = "<template><div class=\"thumbnail ${hasLoaded ? 'show' : 'hidden'}\" style=\"border:0 none;box-shadow:none\"><img src=\"${frame.picture.imageUrl}\" load.trigger=\"setHasLoaded()\"><div class=\"caption\"><h3>${frame.name}</h3><p>${frame.description}</p><p>Alto: ${frame.height} cm.</p><p>Ancho: ${frame.length} cm.</p><p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">$ ${frame.price} - Personalizar</a></p></div></div></template>"; });
define('text!components/frame/frame-update-data-form.html', ['module'], function(module) { module.exports = "<template><form role=\"form\" submit.delegate=\"update()\"><div class=\"form-group\"><label for=\"name\">Nombre:</label><input type=\"text\" class=\"form-control\" value.bind=\"frame.name & validate\"></div><div class=\"form-group\"><label for=\"description\">Descripcion:</label><textarea class=\"form-control\" name=\"description\" cols=\"100\" rows=\"5\" value.bind=\"frame.description\"></textarea></div><div class=\"form-group\"><label for=\"height\">Alto:</label><input type=\"number\" class=\"form-control\" value.bind=\"frame.height & validate\"></div><div class=\"form-group\"><label for=\"length\">Ancho:</label><input type=\"number\" class=\"form-control\" value.bind=\"frame.length & validate\"></div><div class=\"form-group\"><label for=\"price\">Precio:</label><input type=\"number\" class=\"form-control\" value.bind=\"frame.price & validate\"></div><div class=\"form-group\"><div class=\"alert alert-warning\" repeat.for=\"error of validationController.errors\">${error.message}</div><div class=\"alert alert-danger\" if.bind=\"serverError.title\"><strong>${serverError.title}</strong> ${serverError.description}</div><div class=\"alert alert-success\" if.bind=\"success\"><strong>Exito!</strong> La imagen se subio correctamente.</div></div><button type=\"submit\" class=\"btn btn-primary\" if.bind=\"!isWorking\">Subir</button> <button type=\"reset\" class=\"btn btn-default\">Limpiar</button> <button type=\"button\" class=\"btn btn-primary disabled\" if.bind=\"isWorking\"><i class=\"fa fa-spinner fa-spin\"></i> Subiendo...</button></form></template>"; });
define('text!components/frame/frame-update-picture-form.html', ['module'], function(module) { module.exports = ""; });
define('text!components/frame/frame-upload-form.html', ['module'], function(module) { module.exports = "<template><form role=\"form\" submit.delegate=\"upload()\"><div class=\"form-group\"><label for=\"name\">Nombre:</label><input type=\"text\" class=\"form-control\" value.bind=\"name & validate\"></div><div class=\"form-group\"><label for=\"uniqueName\">Nombre unico:</label><input type=\"text\" class=\"form-control\" value.bind=\"uniqueName & validate\"></div><div class=\"form-group\"><label for=\"description\">Descripcion:</label><textarea class=\"form-control\" name=\"description\" cols=\"100\" rows=\"5\" value.bind=\"description\"></textarea></div><div class=\"form-group\"><label for=\"height\">Alto:</label><input type=\"number\" class=\"form-control\" value.bind=\"height & validate\"></div><div class=\"form-group\"><label for=\"width\">Ancho:</label><input type=\"number\" class=\"form-control\" value.bind=\"width & validate\"></div><div class=\"form-group\"><label for=\"price\">Precio:</label><input type=\"number\" class=\"form-control\" value.bind=\"price & validate\"></div><div class=\"form-group\"><label for=\"imageFile\">Imagen:</label><input type=\"file\" class=\"form-control\" files.bind=\"imageFiles & validate\" accept=\".jpg,.jpeg,.png\"></div><div class=\"form-group\"><label for=\"imageUniqueName\">Nombre unico de imagen:</label><input type=\"text\" class=\"form-control\" value.bind=\"imageUniqueName & validate\"></div><div class=\"form-group\"><label for=\"imageFormatName\">Formato de imagen:</label><input type=\"text\" class=\"form-control\" value.bind=\"imageFormatName & validate\" placeholder=\"ej: jpg\"></div><div class=\"form-group\"><div class=\"alert alert-warning\" repeat.for=\"error of validationController.errors\">${error.message}</div><div class=\"alert alert-danger\" if.bind=\"serverError.title\"><strong>${serverError.title}</strong> ${serverError.description}</div><div class=\"alert alert-success\" if.bind=\"success\"><strong>Exito!</strong> La imagen se subio correctamente.</div></div><button type=\"submit\" class=\"btn btn-primary\" if.bind=\"!isWorking\">Subir</button> <button type=\"reset\" class=\"btn btn-default\">Limpiar</button> <button type=\"button\" class=\"btn btn-primary disabled\" if.bind=\"isWorking\"><i class=\"fa fa-spinner fa-spin\"></i> Subiendo...</button></form></template>"; });
define('text!components/picture/canvas-test.html', ['module'], function(module) { module.exports = "<template><input id=\"ANGLE\" type=\"range\" min=\"-1\" max=\"1\" value=\"0\" step=\"0.05\" value.bind=\"rangeVal\" click.delegate=\"showVal()\"><br><canvas ref=\"canvas\" id=\"canvas\" width=\"600\" height=\"800\" style=\"border:1px solid red\"></canvas></template>"; });
define('text!components/picture/picture-test.html', ['module'], function(module) { module.exports = "<template><button type=\"button\" click.delegate=\"test()\">Test</button><div id=\"myCanvas\" style=\"background:gray;width:960px;height:540px\"><img src=\"${pictureUrl}\" if.bind=\"isLoaded\" id=\"dragTest\"></div></template>"; });
define('text!components/picture/picture-upload.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"doUpload()\"><input id=\"files\" type=\"file\" accept=\".jpg,.jpeg,.png\" files.bind=\"selectedFiles\" class=\"form-control\"> <input type=\"submit\" class=\"btn btn-primary\" value=\"Upload\" if.bind=\"selectedFiles.length > 0\"></form></template>"; });
define('text!components/user/user-list.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col-md-8 col-md-offset-2\"><div class=\"alert alert-danger\" if.bind=\"error.description\"><strong>${error.title}</strong> ${error.description}</div></div></div><div class=\"row\"><div class=\"col-md-10 col-md-offset-1\"><table class=\"table table-bordered\" if.bind=\"users\"><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Rol</th><th>Estado</th></tr><tr repeat.for=\"user of users\"><td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td><td>${user.email}</td><td>${user.role.name}</td><td>${user.state.name}</td></tr></table></div></div></template>"; });
define('text!components/user/user-login.html', ['module'], function(module) { module.exports = "<template><form role=\"form\" submit.delegate=\"login()\"><div class=\"form-group\"><label for=\"email\">Email:</label><input type=\"email\" class=\"form-control\" value.bind=\"email & validate\" placeholder=\"ej: juan.perez@email.com\"></div><div class=\"form-group\"><label for=\"password\">Contraseña:</label><input type=\"password\" class=\"form-control\" value.bind=\"password & validate\"></div><div class=\"form-group\"><div class=\"alert alert-warning\" repeat.for=\"error of validationController.errors\">${error.message}</div><div class=\"alert alert-danger\" if.bind=\"serverError.title\"><strong>${serverError.title}</strong> ${serverError.description}</div><div class=\"alert alert-success\" if.bind=\"success\"><strong>Exito!</strong> El usuario fue registrado correctamente.</div></div><button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" if.bind=\"!isWorking\">Ingresar</button> <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block disabled\" if.bind=\"isWorking\"><i class=\"fa fa-spinner fa-spin\"></i> Ingresando...</button></form></template>"; });
define('text!components/user/user-registration.html', ['module'], function(module) { module.exports = "<template><form role=\"form\" submit.delegate=\"register()\"><div class=\"form-group\"><label for=\"firstName\">Nombre:</label><input type=\"text\" class=\"form-control\" value.bind=\"firstName & validate\" placeholder=\"ej: Juan\"></div><div class=\"form-group\"><label for=\"lastName\">Apellido:</label><input type=\"text\" class=\"form-control\" value.bind=\"lastName & validate\" placeholder=\"ej: Perez\"></div><div class=\"form-group\"><label for=\"email\">Email:</label><input type=\"email\" class=\"form-control\" value.bind=\"email & validate\" placeholder=\"ej: juan.perez@email.com\"></div><div class=\"form-group\"><label for=\"password\">Contraseña:</label><input type=\"password\" class=\"form-control\" value.bind=\"password & validate\"></div><div class=\"form-group\"><div class=\"alert alert-warning\" repeat.for=\"error of validationController.errors\">${error.message}</div><div class=\"alert alert-danger\" if.bind=\"serverError.title\"><strong>${serverError.title}</strong> ${serverError.description}</div><div class=\"alert alert-success\" if.bind=\"success\"><strong>Exito!</strong> El usuario fue registrado correctamente.</div></div><button type=\"submit\" class=\"btn btn-success btn-lg btn-block\" if.bind=\"!isWorking\">Registrarse</button> <button type=\"submit\" class=\"btn btn-success btn-lg btn-block disabled\" if.bind=\"isWorking\"><i class=\"fa fa-spinner fa-spin\"></i> Enviando...</button></form></template>"; });
define('text!layouts/main/login-modal.html', ['module'], function(module) { module.exports = "<template><div class=\"modal fade\" id=\"userLoginModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"userLoginModal\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\" id=\"myModalLabel\">Iniciar sesion</h4></div><div class=\"modal-body\"><require from=\"../../components/user/user-login\"></require><div class=\"row\"><div class=\"col-md-12\"><user-login></user-login></div></div></div><div class=\"modal-footer\"></div></div></div></div></template>"; });
define('text!layouts/main/nav-bar.html', ['module'], function(module) { module.exports = "<template><nav class=\"navbar navbar-default\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#\">WeFrame</a></div><div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\"><ul class=\"nav navbar-nav\"><li class=\"active\"><a href=\"#\">Link <span class=\"sr-only\">(current)</span></a></li><li><a href=\"#\">Link</a></li><li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Admin <span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li><a route-href=\"route: index\">Galeria de marcos</a></li><li><a route-href=\"route: frame-admin-list\">Lista de marcos</a></li><li><a route-href=\"route: frame-admin\">Marcos</a></li><li role=\"separator\" class=\"divider\"></li><li><a route-href=\"route: user-admin-list\">Lista de usuarios</a></li></ul></li></ul><ul class=\"nav navbar-nav navbar-right\"><li><button type=\"button\" class=\"btn btn-primary navbar-btn\" data-toggle=\"modal\" data-target=\"#userLoginModal\">Ingresar</button></li><li><p class=\"navbar-text\"></p></li><li><button type=\"button\" class=\"btn btn-success navbar-btn\" data-toggle=\"modal\" data-target=\"#userRegistrationModal\">Registrarse</button></li></ul></div></div></nav><require from=\"./login-modal\"></require><login-modal></login-modal><require from=\"./registration-modal\"></require><registration-modal></registration-modal></template>"; });
define('text!layouts/main/registration-modal.html', ['module'], function(module) { module.exports = "<template><div class=\"modal fade\" id=\"userRegistrationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"userRegistrationModal\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\" id=\"myModalLabel\">Registrarse</h4></div><div class=\"modal-body\"><require from=\"../../components/user/user-registration\"></require><div class=\"row\"><div class=\"col-md-12\"><user-registration></user-registration></div></div></div><div class=\"modal-footer\"></div></div></div></div></template>"; });
define('text!components/callback.html', ['module'], function(module) { module.exports = "<template><div class=\"spinner\"><i class=\"fa fa-spinner fa-spin\"></i></div></template>"; });
//# sourceMappingURL=app-bundle.js.map