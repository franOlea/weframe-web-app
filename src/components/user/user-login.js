import {inject, NewInstance} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationController, validateTrigger, ValidationRules} from 'aurelia-validation';
import {SessionService} from '../../services/session-service';
import environment from '../../environment';

@inject(SessionService, NewInstance.of(ValidationController), EventAggregator)
export class UserLogin {
    
    email = '';
    password = '';

    constructor(sessionService, validationController, eventAggregator) {
        this.sessionService = sessionService;
        this.validationController = validationController;
        this.eventAggregator = eventAggregator;
        this.resetFields();
    }

    created() {
        console.log(modalId);
    }

    resetFields() {
        this.isWorking = false;
        this.success = false;
        this.serverError = {};
        this.email = '';
        this.password = '';
    }

    created() {
        this.validationController.validateTrigger = validateTrigger.manual;

        ValidationRules
            .ensure("email").email().required().withMessage("Por favor ingrese un email.")
            .ensure("password").required().withMessage("Por favor ingrese la contraseña.")
            .on(this);
    }

    login() {
        this.validationController.validate().then((validation) => {
            if(validation.valid) {
                this.doLogin();
            }
        });
    }

    doLogin() {
        this.isWorking = true;

        var userCredentials = { 
            username: this.email, 
            password: this.password
        }

        this.sessionService.login(userCredentials).then(result => {
            if(result) {
                this.success = true;
                setTimeout(() => {
                    $("#userLoginModal").modal("hide");
                    this.resetFields();
                }, 1500);
            } else {
                this.resetFields();
                this.success = false;
                this.serverError = {
                    title: "Error",
                    description: "Email o contraseña incorrectos."
                }
                this.isWorking = false;
            }
        });
    }
}