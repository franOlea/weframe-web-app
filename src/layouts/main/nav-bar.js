import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SessionService } from '../../services/session-service';
import environment from '../../environment';

@inject(EventAggregator, SessionService)
export class NavBar {

    authenticated = false;
    user = {};

    constructor(eventAggregator, sessionService) {
		this.eventAggregator = eventAggregator;
        this.sessionService = sessionService;

		this.subscribeToAuthenticationEvent();
        this.sessionService.init();
    }

    subscribeToAuthenticationEvent() {
        console.log("subscribed for session events");
        this.eventAggregator.subscribe(environment.authenticationChangedEventName, authState => {
			this.authenticated = authState.authenticated;
            console.log(authState);
		});

        this.eventAggregator.subscribe(environment.currentUserRetrievedEventName, user => {
			this.user = user;
            console.log(user);
		});
    }

    logout() {
        this.sessionService.logout();
    }
}