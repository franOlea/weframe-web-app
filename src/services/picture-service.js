import {HttpClient} from 'aurelia-http-client';
import environment from '../environment';

export class PictureService {
    constructor() {
        this.restClient = new HttpClient();
    }

    getPicture(uniquePictureName, isOriginalSize) {
        return this.restClient.createRequest(environment.webApiPicturesPath)
                .asGet()
                .withParams({
                    uniqueName: uniquePictureName,
                    original: isOriginalSize
                })
                .withBaseUrl(environment.webApiUrl)
                .withTimeout(5000)
                .send();
    }

    putPicture(uniqueName, file, formatName, onProgress) {
        var formData = new FormData();
        formData.append('uniqueName', uniqueName);
        formData.append('file', file);
        formData.append('formatName', formatName);

        return this.restClient.createRequest(environment.webApiPicturesPath)
            .asPost()
            .withContent(formData)
            .withBaseUrl(environment.webApiUrl)
            .withProgressCallback((evt)=>console.log(evt))
            .send();
    }
}