import {inject} from 'aurelia-framework';
import {FrameService} from '../../services/frame-service';
import {PictureService} from '../../services/picture-service';

@inject(FrameService, PictureService)
export class FrameList {
    constructor(frameService, pictureService) {
        this.frameService = frameService;
        this.pictureService = pictureService;
        // this.frames = [];
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

    showDetails(frameId) {
        this.frames.forEach(function(frame) {
            if(frame.id == frameId) {
                this.selectedFrame = frame;
                this.pictureService.getPicture(this.selectedFrame.picture.imageKey, true).then(
                    (success) => {
                        this.selectedFrame.picture.imageUrl = JSON.parse(success.response).imageUrl;
                        this.frameDetailsViewModel.frame = JSON.parse(JSON.stringify(this.selectedFrame));
                        console.log(this.frameDetailsViewModel);
                    },
                    (failure) => {
                        console.log(failure);
                    }
                )
            }
        }, this);
    }
}