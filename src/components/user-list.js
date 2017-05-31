import {inject} from 'aurelia-framework';
import {UserService} from '../services/user-service';

@inject(UserService)
export class UserList {
    constructor(userService) {
        this.userService = userService;
        this.users = [];
        // this.error = {};
    }

    created() {
        this.updateUserList(0, 10);
    }

    updateUserList(page, size) {
        this.userService.getUsers(page, size)
                .then(
                    userResponse => this.users = JSON.parse(userResponse.response), 
                    errorResponse => {
                        this.error.title = 'Ups';
                        this.error.description = 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.';
                    }
                );
    }
    
}