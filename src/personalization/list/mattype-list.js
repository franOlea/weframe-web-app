import {inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { MattypeService } from '../../mattype/mattype-service';
import environment from '../../environment';

@inject(MattypeService, EventAggregator)
export class MattypeList {

    constructor(mattypeService, eventAggregator) {
        this.mattypeService = mattypeService;
        this.eventAggregator = eventAggregator;
        this.mattypes = [];
        this.isWorking = false;
    }

    created() {
        this.updateMattypeList(0,10);
    }

    updateMattypeList(page, size) {
        this.isWorking = true;
        this.mattypeService.getMattypes(page, size).then(
            mattypeResponse => {
                this.mattypes = mattypeResponse;
                this.error = null;
                this.isWorking = false;
            }, 
            errorResponse => {
                this.error = {
                    title: 'Ups',
                    description: 'Parece que el sistema no response, por favor intenta nuevamente mas tarde.'
                };
                this.isWorking = false;
            }
        );
    }

    select(mattype) {
        this.eventAggregator.publish(environment.canvasSelectedBackmatChanged, mattype);
    }
}