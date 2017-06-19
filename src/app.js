import { inject } from 'aurelia-framework';
import { AuthService } from './services/auth-service';

@inject(AuthService)
export class App {
	configureRouter(config, router) {
		config.title = 'WeFrame';
		config.map([
			{
				route: ['', '/'],
				moduleId: './components/frame/frame-gallery',
				title: 'Marcos',
				name: 'index'
			},
			{
				route: 'frame-admin-list',
				moduleId: './components/frame/frame-list',
				title: 'Panel de administrador',
				name: 'frame-admin-list'
			},
			{
				route: 'frame-admin',
				moduleId: './layouts/frame-admin-panel-layout',
				title: 'Panel de administrador',
				name: 'frame-admin'
			},
			{
				route: 'user-admin-list',
				moduleId: './components/user/user-list',
				title: 'Panel de administrador',
				name: 'user-admin-list'
			},
			{
				route: 'callback',
				name: 'callback',
				moduleId: './components/callback',
				nav: false,
				title: 'Callback'
			}
		]);

		this.router = router;
	}

	constructor(authService) {
		this.authService = authService;
		this.authenticated = this.authService.isAuthenticated();
		this.authService.authNotifier.subscribe('authChange', authState => {
			this.authenticated = authState.authenticated;
		});
	}

	login() {
		this.authService.login();
	}

	logout() {
		this.authService.logout();
	}
}
