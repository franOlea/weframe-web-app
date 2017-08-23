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
				moduleId: './user/admin/user-list',
				title: 'Usuarios',
				name: 'index'
			},
			{
				route: 'frame-gallery',
				moduleId: './frame/gallery/frame-gallery',
				title: 'Galeria de marcos',
				name: 'frame-gallery'
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
				route: 'frame-canvas',
				moduleId: './personalization/frame-canvas',
				title: 'Personalizacion de marcos',
				name: 'frame-canvas'
			}
		]);

		this.router = router;
	}
}
