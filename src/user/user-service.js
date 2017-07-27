import { inject } from 'aurelia-framework';
import { RestService } from '../services/rest-service';
import environment from '../environment';

@inject(RestService)
export class UserService {

    constructor(restService) {
        this.restService = restService;
    }

    getUsers(page = 0, size = 10) {
        console.log("[UserService] Getting users page " + page + " size " + size);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiUsersPath)
                .asGet().withTimeout(5000)
                .withParams({ page: page, size: size }).send()
                .then(
                    success => {
                        console.log("[UserService] User page response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve([]);
                        }
                    },
                    failure => {
                        console.log("[UserService] User page request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

    getUser(id) {
        console.log("[UserService] Getting user " + id);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiUsersPath + `/${id}`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[UserService] User response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[UserService] User request FAILED");
                        reject();
                    }
                );
        });
    }

    getUsersCount() {
        console.log("[UserService] Getting users count");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiUsersPath + `/count`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[UserService] Users count response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(success.response);
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[UserService] User count request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

    getCurrentUser() {
        console.log("[UserService] Getting current user");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiUsersPath + `/me`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[UserService] Current user response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[UserService] Current user page request FAILED");
                        reject();
                    }
                );
        });
    }

    postUser(user) {
        console.log("[UserService] Posting user");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiUsersPath)
                .asPost().withContent(user).withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[UserService] User post response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    failure => {
                        console.log("[UserService] User post request FAILED");
                        reject();
                    }
                );
        });
    }
}