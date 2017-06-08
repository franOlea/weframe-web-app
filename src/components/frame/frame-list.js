import {inject} from 'aurelia-framework';
import {FrameService} from '../../services/frame-service';

@inject(FrameService)
export class FrameList {
    constructor(frameService) {
        this.frameService = frameService;
        this.frames = [];
        this.error = {};
        this.isWorking = false;
    }

    created() {
        this.updateFrameList(0,10);
    }

    updateFrameList(page, size) {
        this.isWorking = true;
        this.frameService.getFrames(page, size)
                .then(
                    frameResponse => {
                        this.frames = JSON.parse(frameResponse.response);
                        this.isWorking = false;
                    }, 
                    errorResponse => {
                        this.error.title = 'Ups';
                        this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                        this.isWorking = false;
                    }
                );
    }
}