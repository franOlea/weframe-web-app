import {inject} from 'aurelia-framework';
import {UserService} from '../user-service';

@inject(UserService)
export class UserList {

    currentPage = 0;

    constructor(userService) {
        this.userService = userService;
    }

    created() {
        this.loadPage(this.currentPage);
    }

    loadPage(page = 0, size = 10) {
        this.working = true;
        this.userService.getUsers(page, size).then(
            users => {
                this.users = users;
                this.currentPage = page;
            },
            failure => {
                console.log(failure);
                this.error = {};
                this.error.title = 'Ups';
                this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                this.working = false;
            }
        );
    }

}