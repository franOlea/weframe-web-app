import { inject } from 'aurelia-framework';
import { RestService } from '../services/rest-service';
import environment from '../environment';

@inject(RestService)
export class MattypeService {
    constructor(restService) {
        this.restService = restService;
    }

    getMattypes(page = 0, size = 10) {
        console.log("[MattypeService] Getting frames page " + page + " size " + size);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiMattypesPath)
                .asGet().withTimeout(5000)
                .withParams({ page: page, size: size }).send()
                .then(
                    success => {
                        console.log("[MattypeService] Mattype page response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve([]);
                        }
                    },
                    failure => {
                        console.log("[MattypeService] Mattype page request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

    getMattype(id) {
        console.log("[MattypeService] Getting frame " + id);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiMattypesPath + `/${id}`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[MattypeService] Mattype response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[MattypeService] Mattype request FAILED");
                        reject();
                    }
                );
        });
    }

    getMattypesCount() {
        console.log("[MattypeService] Getting Mattypes count");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiMattypesPath + `/count`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[MattypeService] Mattypes count response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(success.response);
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[MattypeService] Mattype count request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

}