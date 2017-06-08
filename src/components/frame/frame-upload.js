import {inject, NewInstance} from 'aurelia-framework';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';
import {PictureService} from '../../services/picture-service';
import {FrameService} from '../../services/frame-service';

@inject(PictureService,FrameService,NewInstance.of(ValidationController))
export class FrameUpload {

    constructor(pictureService, frameService, validationController) {
        this.pictureService = pictureService;
        this.frameService = frameService;
        this.validationController = validationController;
        this.isWorking = false;
        this.success = false;
        this.serverError = {};
    }

    created() {
        this.validationController.validateTrigger = validateTrigger.manual;

        ValidationRules
            .ensure("name")
                    .required()
                    .withMessage("El nombre unico no puede estar vacio.")
            .ensure("uniqueName")
                    .required()
                    .withMessage("El nombre unico no puede estar vacio.")
            .ensure("imageUniqueName")
                    .required()
                    .withMessage("El nombre unico de la imagen no puede estar vacio.")
            .ensure("imageFile")
                    .required()
                    .withMessage("El archivo no puede estar vacio.")
            .ensure("imageFormatName")
                    .required()
                    .withMessage("El nombre del formato de archivo de imagen no puede estar vacio.")
            .on(this);
    }

    upload() {
        this.success = false;
        this.isWorking = true;

        console.log(this.imageFiles);

        this.validationController.validate().then((validation) => {
            if(validation.valid) {
                this.doUpload();
                // setTimeout(() => {
                //     this.success = true;
                // }, 1000).then(() => this.isWorking = false);
            } else {
                this.isWorking = false
            }
        });
    }

    doUpload() {
        return this.pictureService.putPicture(
            this.imageUniqueName,
            this.imageFiles[0],
            this.imageFormatName,
            null)
            .then(
                () => {
                    this.doUploadFrame();
                },
                failure => {
                    var failureMessage = JSON.parse(failure.response);
                    this.serverError = {
                        title: failureMessage.title,
                        description: failureMessage.description
                    };
                }
            );
    }

    doUploadFrame() {
        var frame = {
            name: this.name,
            uniqueName: this.uniqueName,
            description: this.description,
            height: this.height,
            length: this.width,
            picture: {
                imageKey: this.imageUniqueName
            },
            price: this.price
        };

        this.frameService.postFrame(frame).then(
            () => {
                this.success = true;
            },
            failure => {
                var failureMessage = JSON.parse(failure.response);
                this.serverError = {
                    title: failureMessage.title,
                    description: failureMessage.description
                };
            }
        ).then(() => this.isWorking = false);
    }

}