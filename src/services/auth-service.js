import auth0 from 'auth0-js';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router)
export class AuthService {
    auth0 = new auth0.WebAuth({
        domain: 'weframe.auth0.com',
        clientID: '7DJzxL1JidZ8QNiGDt8d05183roJGIfJ',
        redirectUri: 'http://localhost:9000/callback',
        audience: 'https://weframe.auth0.com/userinfo',
        responseType: 'token id_token',
        scope: 'openid'
    });

    authNotifier = new EventAggregator();

    constructor(Router) {
        this.router = Router;
    }

    login() {
        this.auth0.authorize();
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                this.router.navigate('home');
                this.authNotifier.publish('authChange', { authenticated: true });
            } else if (err) {
                console.log(err);
            }
        });
    }

    setSession(authResult) {
        // Set the time that the access token will expire at
        let expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.router.navigate('home');
        this.authNotifier.publish('authChange', false);
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}