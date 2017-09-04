import {inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BackboardService } from '../../backboard/backboard-service';
import environment from '../../environment';

@inject(BackboardService, EventAggregator)
export class BackboardList {

    constructor(backboardService, eventAggregator) {
        this.backboardService = backboardService;
        this.eventAggregator = eventAggregator;
        this.backboards = [];
        this.isWorking = false;
    }

    created() {
        this.updateBackboardList(0,10);
    }

    updateBackboardList(page, size) {
        this.isWorking = true;
        this.backboardService.getBackboards(page, size).then(
            backboardResponse => {
                this.backboards = backboardResponse;
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

    select(backboard) {
        this.eventAggregator.publish(environment.canvasSelectedBackboardChanged, backboard);
    }
}