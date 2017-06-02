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
}