import {inject, NewInstance} from 'aurelia-framework';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';
import {UserService} from '../../services/user-service';

@inject(UserService,NewInstance.of(ValidationController))
export class UserLogin {
    
    email = '';
    password = '';

    constructor(userService, validationController) {
        this.userService = userService;
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

        setTimeout(() => {
            this.validationController.validate()
                .then((validation) => {
                    if(validation.valid) {
                        this.success = true;
                    }
                }).then(() => this.isWorking = false);
        }, 1000);
    }
}