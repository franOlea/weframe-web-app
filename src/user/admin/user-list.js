import {inject} from 'aurelia-framework';
import {UserService} from '../user-service';

@inject(UserService)
export class UserList {
    pageSize = 10;
    currentPage = 0;

    hasPreviousPage = false;
    hasNextPage = true;

    constructor(userService) {
        this.userService = userService;
    }

    created() {
        this.loadPage(this.currentPage);
    }

    loadPage(page = 0) {
        this.working = true;
        this.userService.getUsersCount().then(
            count => {
                this.doLoadPage(page, count);
            },
            failue => {
                this.fail(failure);
            }
        )
    }

    doLoadPage(page = 0, count) {
        this.userService.getUsers(page, this.pageSize).then(
            users => {
                this.users = users;
                this.hasNextPage = (count > ((page + 1) * this.pageSize));
                this.hasPreviousPage = page > 0;
                this.currentPage = page;
            },
            failure => {
                this.fail(failure);
            }
        ).then(() => this.working = true);
    }

    fail(failure) {
        console.log(failure);
        this.error = {};
        this.error.title = 'Ups';
        this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
    }

}