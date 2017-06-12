import {bindable} from 'aurelia-framework';
import {inject, NewInstance} from 'aurelia-framework';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';
import {FrameService} from '../../services/frame-service';

@inject(FrameService,NewInstance.of(ValidationController))
export class FrameUpdateDataForm {
    
    @bindable frame;

    constructor(frameService, validationController) {
        this.frameService = frameService;
        this.validationController = validationController;
        this.isWorking = false;
        this.success = false;
        this.serverError = {};
    }

    created() {
        this.validationController.validateTrigger = validateTrigger.manual;

        ValidationRules
            .ensure("frame.name")
                    .required()
                    .withMessage("El nombre unico no puede estar vacio.")
            .ensure("frame.description")
                    .required()
                    .withMessage("La descripcion no puede estar vacia.")
            .ensure("frame.height")
                    .required()
                    .satisfies(value => value > 0)
                    .withMessage("El alto del marco no puede estar vacio o ser menor a 0.")
            .ensure("frame.length")
                    .required()
                    .satisfies(value => value > 0)
                    .withMessage("El ancho del marco no puede estar vacio o ser menor a 0.")
            .ensure("frame.prive")
                    .required()
                    .satisfies(value => value > 0)
                    .withMessage("El precio del marco no puede estar vacio o ser menor a 0.")
            .on(this);
    }

    upload() {
        this.success = false;
        this.isWorking = true;

        console.log(this.imageFiles);

        this.validationController.validate().then((validation) => {
            if(validation.valid) {
                // this.doUpload();
                setTimeout(() => {
                    this.success = true;
                }, 1000).then(() => this.isWorking = false);
            } else {
                this.isWorking = false
            }
        });
    }

}