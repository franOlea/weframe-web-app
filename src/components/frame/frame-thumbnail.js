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
}