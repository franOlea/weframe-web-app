import {inject, NewInstance} from 'aurelia-framework';
import {UserService} from '../services/user-service';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';

@inject(UserService,NewInstance.of(ValidationController))
export class UserRegistration {
    
    firstName = '';
    lastName = '';
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
            .ensure("firstName").required().withMessage("El nombre no puede estar vacio.")
            .ensure("lastName").required().withMessage("El apellido no puede estar vacio.")
            .ensure("email").email().required().withMessage("El email no es valido, por favor ingrese un email valido.")
            .ensure("password").minLength(8).required().withMessage("La contraseña debe tener al menos 8 caracteres")
            .on(this);
    }

    register() {
        this.success = false;
        this.isWorking = true;

        var user = { 
            firstName: this.firstName,
            lastName: this.lastName,
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

    postUser(user) {
        this.userService.postUser(user).then(
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