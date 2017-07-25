import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import environment from '../environment';

@inject(EventAggregator)
export class RestService {
    constructor(eventAggregator) {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl(environment.webApiUrl);
                // x.withHeader('Authorization', '');
            });
		this.eventAggregator = eventAggregator;
		this.subscribeToAuthenticationEvent();
    }

    subscribeToAuthenticationEvent() {
        this.eventAggregator.subscribe(environment.authenticationChangedEventName, authState => {
			console.log("REST SERVICE NOTIFIED: "+authState.token);
			this.authenticated = authState.authenticated;
            if(authState.token) {
                this.setAuthorizationHeader(authState.token);
            } else {
                this.setAuthorizationHeader(null);
            }
		});
    }

    setAuthorizationHeader(authorizationHeader) {
        if(authorizationHeader) {
            this.httpClient = new HttpClient()
                .configure(x => {
                x.withBaseUrl(environment.webApiUrl);
                x.withHeader('Authorization', authorizationHeader);
            });
        } else {
            this.httpClient = new HttpClient()
                .configure(x => {
                x.withBaseUrl(environment.webApiUrl);
                // x.withHeader('Authorization', authorizationHeader);
            });
        }
            
    }

    getClient() {
        return this.httpClient;
    }
}