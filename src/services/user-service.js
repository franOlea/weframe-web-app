import {HttpClient} from 'aurelia-http-client';
import environment from '../environment';

export class UserService {
    constructor() {
        this.restClient = new HttpClient();
    }

    getUsers() {
        return getUsers(0, 10);
    }

    getUsers(pageNumber, pageSize) {
        return this.restClient.createRequest(environment.webApiUsersPath)
                .asGet()
                .withBaseUrl(environment.webApiUrl)
                .withTimeout(5000)
                .send()
    }

    getUser(id) {
        return this.restClient.createRequest(environment.webApiUsersPath + `/${id}`)
                .asGet()
                .withBaseUrl(environment.webApiUrl)
                .withTimeout(2000)
                .send()
    }

    postUser(user) {
        return this.restClient.createRequest(environment.webApiUsersPath)
                .asPost()
                .withBaseUrl(environment.webApiUrl)
                .withContent(user)
                .withTimeout(3000)
                .send()
    }

}