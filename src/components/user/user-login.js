import {inject, NewInstance} from 'aurelia-framework';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';
import {SessionService} from '../../services/session-service';

@inject(SessionService,NewInstance.of(ValidationController))
export class UserLogin {
    
    email = '';
    password = '';

    constructor(sessionService, validationController) {
        this.sessionService = sessionService;
        this.validationController = validationController;
        this.isWorking = false;
        this.success = false;
        this.serverError = {};
    }

    created() {
        this.validationController.validateTrigger = validateTrigger.manual;

        ValidationRules
            .ensure("email").email().required().withMessage("Por favor ingrese un email.")
            .ensure("password").required().withMessage("Por favor ingrese la contraseña.")
            .on(this);
    }

    login() {
        this.success = false;
        this.isWorking = true;

        var userCredentials = { 
            email: this.email, 
            password: this.password
        }

        this.sessionService.login(userCredentials).then(
            success => {
                console.log("LOGIN SUCCESS");
                console.log(success);
            },
            failue => {
                console.log("LOGIN FAIL");
                console.log(failure);
            }
        )

        // setTimeout(() => {
        //     this.validationController.validate()
        //         .then((validation) => {
        //             if(validation.valid) {
        //                 this.success = true;
        //             }
        //         }).then(() => this.isWorking = false);
        // }, 1000);
    }
}