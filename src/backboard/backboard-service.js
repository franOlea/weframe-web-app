import { inject } from 'aurelia-framework';
import { RestService } from '../services/rest-service';
import environment from '../environment';

@inject(RestService)
export class BackboardService {
    constructor(restService) {
        this.restService = restService;
    }

    getBackboards(page = 0, size = 10) {
        console.log("[BackboardService] Getting frames page " + page + " size " + size);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiBackboardsPath)
                .asGet().withTimeout(5000)
                .withParams({ page: page, size: size }).send()
                .then(
                    success => {
                        console.log("[BackboardService] Backboard page response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve([]);
                        }
                    },
                    failure => {
                        console.log("[BackboardService] Backboard page request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

    getBackboard(id) {
        console.log("[BackboardService] Getting frame " + id);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiBackboardsPath + `/${id}`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[BackboardService] Backboard response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[BackboardService] Backboard request FAILED");
                        reject();
                    }
                );
        });
    }

    getBackboardsCount() {
        console.log("[BackboardService] Getting Backboards count");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiBackboardsPath + `/count`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[BackboardService] Backboards count response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(success.response);
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[BackboardService] Backboard count request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

}