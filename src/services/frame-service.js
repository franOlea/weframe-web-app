import {HttpClient} from 'aurelia-http-client';
import environment from '../environment';

export class FrameService {
    constructor() {
        this.restClient = new HttpClient();
    }

    getFrames(pageNumber, pageSize) {
        return this.restClient.createRequest(environment.webApiFramesPath)
                .asGet()
                .withBaseUrl(environment.webApiUrl)
                .withTimeout(5000)
                .send()
    }

    getFrame(id) {
        return this.restClient.createRequest(environment.webApiFramesPath + `/${id}`)
                .asGet()
                .withBaseUrl(environment.webApiUrl)
                .withTimeout(2000)
                .send()
    }

    postFrame(frame) {
        return this.restClient.createRequest(environment.webApiFramesPath)
                .asPost()
                .withBaseUrl(environment.webApiUrl)
                .withContent(frame)
                .withTimeout(3000)
                .send()
    }
}