import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController, validateTrigger, ValidationRules } from 'aurelia-validation';
import { RestService } from '../../services/rest-service';
import environment from '../../environment';

@inject(RestService, NewInstance.of(ValidationController))
export class UserRegistration {

    firstName = '';
    lastName = '';
    email = '';
    password = '';

    constructor(restService, validationController) {
        this.restService = restService;
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

        this.postUser(user);
    }

    postUser(user) {
        return this.restService.getClient()
            .createRequest(environment.webApiUserRegistrationPath)
            .asPost()
            .withContent(user)
            .send()
            .then(
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