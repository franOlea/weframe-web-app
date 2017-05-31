import {inject} from 'aurelia-framework';
import {UserService} from '../services/user-service';

@inject(UserService)
export class UserList {
    constructor(userService) {
        this.userService = userService;
        this.users = [];
        this.error = {};
        this.isWorking = false;
    }

    created() {
        this.updateUserList(0, 10);
    }

    updateUserList(page, size) {
        this.isWorking = true;
        this.userService.getUsers(page, size)
                .then(
                    userResponse => {
                        this.users = JSON.parse(userResponse.response);
                        this.isWorking = false;
                    }, 
                    errorResponse => {
                        this.error.title = 'Ups';
                        this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                        this.isWorking = false;
                    }
                );
    }

}