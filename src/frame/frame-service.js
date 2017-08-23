import { inject } from 'aurelia-framework';
import { RestService } from '../services/rest-service';
import environment from '../environment';

@inject(RestService)
export class FrameService {
    constructor(restService) {
        this.restService = restService;
    }

    getFrames(page = 0, size = 10) {
        console.log("[FrameService] Getting frames page " + page + " size " + size);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiFramesPath)
                .asGet().withTimeout(5000)
                .withParams({ page: page, size: size }).send()
                .then(
                    success => {
                        console.log("[FrameService] Frame page response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve([]);
                        }
                    },
                    failure => {
                        console.log("[FrameService] Frame page request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

    getFrame(id) {
        console.log("[FrameService] Getting frame " + id);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiFramesPath + `/${id}`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[FrameService] Frame response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[FrameService] Frame request FAILED");
                        reject();
                    }
                );
        });
    }

    getFramesCount() {
        console.log("[FrameService] Getting Frames count");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiFramesPath + `/count`)
                .asGet().withTimeout(3000).send()
                .then(
                    success => {
                        console.log("[FrameService] Frames count response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(success.response);
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[FrameService] Frame count request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }

}