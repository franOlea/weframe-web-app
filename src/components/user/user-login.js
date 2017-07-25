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
        this.isWorking = false;
        this.success = false;
        this.serverError = {};
		this.subscribeToAuthenticationEvent();
    }

    subscribeToAuthenticationEvent() {
        this.eventAggregator.subscribe(environment.authenticationChangedEventName, authState => {
            console.log(authState);
			if(this.isWorking == true) {
                this.isWorking = false;
                if(authState.authenticated == true) {
                    this.success = true;
                } else {
                    this.success = false;
                    this.serverError = {
                        title: "Error",
                        description: "Email o contraseña incorrectos."
                    }
                }
            }
		});
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
            username: this.email, 
            password: this.password
        }

        this.sessionService.login(userCredentials);
        

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