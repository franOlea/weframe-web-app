import {inject} from 'aurelia-framework';
import {RestService} from './rest-service';
import environment from '../environment';

@inject(RestService)
export class FrameService {
    constructor(restService) {
        this.restService = restService;
    }

    getFrames(pageNumber, pageSize, timeout = 5000) {
        return this.restService.getClient()
                .createRequest(environment.webApiFramesPath)
                .withHeader('page', pageNumber)
                .withHeader('size', pageSize)
                .asGet()
                .withTimeout(timeout)
                .send()
    }

    getFrame(id, timeout = 2000) {
        return this.restService.getClient()
                .createRequest(environment.webApiFramesPath + `/${id}`)
                .asGet()
                .withTimeout(timeout)
                .send()
    }

    postFrame(frame, timeout = 3000) {
        return this.restService.getClient()
                .createRequest(environment.webApiFramesPath)
                .asPost()
                .withContent(frame)
                .withTimeout(timeout)
                .send()
    }

    deleteFrame(id, timeout = 3000) {
        return this.restService.getClient()
                .createRequest(environment.webApiFramesPath + `/${id}`)
                .asDelete()
                .withTimeout(timeout)
                .send();
    }
}