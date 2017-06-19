import { HttpClient } from 'aurelia-http-client';
import environment from '../environment';

export class RestService {
    constructor() {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl(environment.webApiUrl);
                // x.withHeader('Authorization', 'bearer 123');
            });
    }

    setAuthorizationHeader(authorizationHeader) {
        this.httpClient
            .configure(x => {
                x.withHeader('Authorization', authorizationHeader);
            });
    }

    getClient() {
        return this.httpClient;
    }
}