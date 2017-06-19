import {inject} from 'aurelia-framework';
import {FrameService} from '../../services/frame-service';
import {PictureService} from '../../services/picture-service';

@inject(FrameService, PictureService)
export class FrameGallery {
    constructor(frameService, pictureService) {
        this.frameService = frameService;
        this.pictureService = pictureService;
        this.frames = [];
        this.framesPerRow = 6;
        this.error = {};
        this.isWorking = false;
    }

    created() {
        this.updateFrameList(1,10);
    }

    updateFrameList(page, size) {
        this.isWorking = true;
        this.frameService.getFrames(page, size).then(
            frameResponse => {
                this.frames = this.frames.concat(JSON.parse(frameResponse.response));
                this.frameRows = Math.ceil(this.frames.length / this.framesPerRow);
                this.frames.forEach((frame) => {
                    this.pictureService.getPicture(frame.picture.imageKey, false).then(
                        (pictureResponse) => {
                            frame.picture = JSON.parse(pictureResponse.response);
                        },
                        (failure) => {
                            console.log(failure);
                        }
                    );
                }, this);
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