import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {FrameService} from '../../services/frame-service';
import {PictureService} from '../../services/picture-service';

@inject(FrameService, PictureService)
export class FrameThumbnail {

    @bindable id;

    constructor(frameService, pictureService) {
        this.frameService = frameService;
        this.pictureService = pictureService;
        this.isWorking = false;
    }

    created() {
    }
    
    attached() {
        console.log(this.id);
        this.frameService.getFrame(this.id).then(
            success => {
                this.frame = JSON.parse(success.response);
                this.pictureService.getPicture(this.frame.picture.imageKey).then(
                    success => {
                        this.frame.picture = JSON.parse(success.response)
                    },
                    failure => {
                        console.log(failure)
                    }
                );
            },
            failure => {
                console.log(failure);
            }
        );
    }
}