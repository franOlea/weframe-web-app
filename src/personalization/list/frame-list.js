import {inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FrameService } from '../../frame/frame-service';
import environment from '../../environment';

@inject(FrameService, EventAggregator)
export class FrameList {
    
    constructor(frameService, eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.frameService = frameService;
        this.frames = [];
        this.isWorking = false;
    }

    created() {
        this.updateFrameList(0,10);
    }

    updateFrameList(page, size) {
        this.isWorking = true;
        this.frameService.getFrames(page, size).then(
            frameResponse => {
                this.frames = frameResponse;
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

    select(frame) {
        this.eventAggregator.publish(environment.canvasSelectedFrameChanged, frame);
    }
}