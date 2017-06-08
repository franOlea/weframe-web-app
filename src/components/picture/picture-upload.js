import {inject} from 'aurelia-framework';
import {PictureService} from '../../services/picture-service';

@inject(PictureService)
export class PictureUpload {
    constructor(pictureService) {
        this.pictureService = pictureService;
    }

    doUpload() {
        this.pictureService.putPicture('test-file-upload', this.selectedFiles[0], 'png').then(
            (success) => {
                console.log(success);
            },
            (failure) => {
                console.log(failure);
            }
        );
    }

     clearFiles() {
        document.getElementById("files").value = "";
    }
}