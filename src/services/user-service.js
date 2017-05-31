import {HttpClient} from 'aurelia-http-client';
import environment from '../environment';

export class UserService {
    constructor() {
        this.restClient = new HttpClient().configure(x => {
            x.withBaseUrl(environment.webApiUrl);
            x.withHeader('Authorization', 'bearer 123');
        });
    }

    getUsers() {
        return getUsers(0, 10);
    }

    getUsers(pageNumber, pageSize) {
        return this.restClient.createRequest(environment.webApiUsersPath)
                .asGet()
                .withTimeout(5000)
                .withParams({
                    page: pageNumber,
                    size: pageSize
                })
                .send();
    }

    getUser(id) {
        return this.restClient.createRequest(environment.webApiUsersPath + `/${id}`)
                .asGet()
                .withTimeout(2000)
                .send();
    }

    postUser() {
        return this.restClient.createRequest(environment.webApiUsersPath)
                .asPost()
                .withContent(user)
                .withTimeout(3000)
                .send();
    }

}