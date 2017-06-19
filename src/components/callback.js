import { inject } from 'aurelia-framework';
import { AuthService } from '../services/auth-service';

@inject(AuthService)
export class Callback {
  constructor(AuthService) {
    this.auth = AuthService;
    this.auth.handleAuthentication();
  }
}