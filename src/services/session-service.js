import {inject} from 'aurelia-framework';
import {RestService} from './rest-service';
import environment from '../environment';

@inject(RestService)
export class SessionService {
    constructor(restService) {
        this.restService = restService;
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
                .createRequest('login')
                .asPost()
                .withContent(userCredentials)
                .withTimeout(3000)
                .send()
                .then(
                    success => {
                        console.log("SESSION SERVICE SUCCESS");
                        console.log(success);
                    },
                    failue => {
                        console.log("SESSION SERVICE FAIL");
                        console.log(failure);
                    }
                );
    }
}