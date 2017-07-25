import { inject } from 'aurelia-framework';
import { SessionService } from './services/session-service';

@inject(SessionService)
export class App {
	constructor(sessionService) {
		this.sessionService = sessionService;
	}

	configureRouter(config, router) {
		config.options.pushState = true;
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
			}
		]);

		this.router = router;
	}

	login() {
		var credentials = {
			email: "admin@weframe.com",
			password: "password"
		};

		this.sessionService.login(credentials);
	}
}
