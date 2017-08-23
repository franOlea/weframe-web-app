import { inject } from 'aurelia-framework';
import { RestService } from '../rest-service';
import environment from '../environment';

@inject(RestService)
export class PictureService {

    constructor(restService) {
        this.restService = restService;
    }

    getPicture(uniquePictureName, originalSize) {
        console.log("[PictureService] Getting picture " + uniquePictureName + " original size [" + originalSize + "]");
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiPicturesPath)
                .asGet().withTimeout(5000)
                .withParams({ uniqueName: uniquePictureName, original: originalSize}).send()
                .then(
                    success => {
                        console.log("[PictureService] Picture response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(JSON.parse(success.response));
                        } else {
                            resolve({});
                        }
                    },
                    failure => {
                        console.log("[PictureService] Picture request FAILED");
                    }
                );
        });
        return promise;
    }

    postPicture(uniqueName, file, formatName, onProgress) {
        console.log("[PictureService] Posting picture " + uniqueName);
        var formData = new FormData();
        formData.append('uniqueName', uniqueName);
        formData.append('file', file);
        formData.append('formatName', formatName);
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient().createRequest(environment.webApiPicturesPath)
                .asPost().withTimeout(20000)
                .withContent(formData)
                .withProgressCallback((evt)=>console.log(evt))
                .send().then(
                    success => {
                        console.log("[PictureService] Picture post response status " + success.statusCode);
                        if(success.statusCode == 200) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    failure => {
                        console.log("[PictureService] Picture post request FAILED");
                        reject();
                    }
                );
        });
        return promise;
    }
}