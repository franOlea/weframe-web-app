import {inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RestService} from './rest-service';
import environment from '../environment';

@inject(RestService, EventAggregator)
export class SessionService {
    authenticated = false;
    user = {};

    constructor(restService, eventAggregator) {
        this.restService = restService;
        this.eventAggregator = eventAggregator;
		this.init();
    }

    init() {
        this.eventAggregator.subscribe(environment.authenticationChangedEventName, authState => {
			this.authenticated = authState.authenticated;
		});
        var token = this.getCookie("Authorization");
        if(token) {
            console.log("TOKEN FOUND: "+token);
            this.eventAggregator.publish(environment.authenticationChangedEventName, {
                authenticaed: true,
                token: token
            });
        }
    }

    setCookie(cookieName, cookieValue, expirationDays) {
        var date = new Date();
        date.setDate(date.getDate() + (expirationDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

    getCookie(cookieName) {
        var nameEQ = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    login(userCredentials) {
        return this.restService.getClient()
                .createRequest(environment.webApiUserLoginPath)
                .asPost()
                .withContent(userCredentials)
                .send()
                .then(
                    success => {
                        console.log("SUCCESSFUL LOGIN");
                        console.log(success);
                        this.setCookie(
                            "Authorization", 
                            success.headers.headers.authorization.value,
                            1
                        );
                        this.eventAggregator.publish(environment.authenticationChangedEventName, {
                            authenticated: true,
                            token: success.headers.headers.authorization.value
                        });
                        this.fetchCurrentSessionUser();
                    },
                    failure => {
                        console.log("LOGIN FAILURE");
                        console.log(failure);
                        this.eventAggregator.publish(environment.authenticationChangedEventName, {
                            authenticated: false
                        });
                    }
                );
    }

    fetchCurrentSessionUser() {
        if(this.authenticated) {
            this.restService.getClient()
                    .createRequest(environment.webApiCurrentUserPath)
                    .asGet()
                    .send()
                    .then(
                        success => {
                            this.user = JSON.parse(success.response);
                        },
                        failue => {
                            this.user = null;
                        }
                    )
        }
    }

    getUser() {
        if(this.authenticated && this.user) { 
            return this.user;
        } else {
            return null;
        }
    }
}