import {inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RestService} from './rest-service';
import environment from '../environment';

@inject(RestService, EventAggregator)
export class SessionService {
    
    constructor(restService, eventAggregator) {
        this.restService = restService;
        this.eventAggregator = eventAggregator;
    }

    init() {
        var token = this.getCookie("Authorization");
        if(token) {
            console.log("TOKEN FOUND: "+token);
            this.publishSessionChanged(true, token);
            this.fetchCurrentSessionUser();
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
        var _self = this;
        var promise = new Promise(function(resolve, reject) {
            _self.restService.getClient()
                .createRequest(environment.webApiUserLoginPath)
                .asPost().withContent(userCredentials)
                .send().then(
                    success => {
                        var token = success.headers.headers.authorization.value;
                        _self.saveAuthorizationCookie(token, 1);
                        _self.publishSessionChanged(true, token);
                        _self.fetchCurrentSessionUser();
                        resolve(true);
                    },
                    failure => {
                        _self.publishSessionChanged(false);
                        resolve(false);
                    }
                );
        });
        return promise;
    }

    logout() {
        console.log("logout pressed");
        this.eventAggregator.publish(environment.authenticationChangedEventName, {
            authenticaed: false,
            token: null
        });
        this.saveAuthorizationCookie(null);
    }

    saveAuthorizationCookie(token, expirationDays = -1) {
        this.setCookie(
            "Authorization", 
            token,
            expirationDays
        );
    }

    publishSessionChanged(authenticated, token = null) {
        this.eventAggregator.publish(environment.authenticationChangedEventName, {
            authenticated: authenticated,
            token: token
        });
    }

    publishUserChanged(user) {
        this.eventAggregator.publish(
            environment.currentUserRetrievedEventName, 
            user
        );
    }

    fetchCurrentSessionUser() {
        this.restService.getClient()
                .createRequest(environment.webApiCurrentUserPath)
                .asGet()
                .send()
                .then(
                    success => {
                        if(success.statusCode == 200) {
                            var user = JSON.parse(success.response);
                            this.publishUserChanged(user);
                        } else {
                            this.publishUserChanged(null);
                            this.publishSessionChanged(false);
                        }
                    },
                    failue => {
                        this.publishUserChanged(null);
                        this.publishSessionChanged(false);
                        this.saveAuthorizationCookie(null);
                    }
                );
    }
}