import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import environment from '../environment';

@inject(EventAggregator)
export class FrameCanvas {
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    created() {
        this.eventAggregator.subscribe(environment.canvasSelectedFrameChanged, frame => {
            console.log("[FrameCanvas] Frame changed to [" + frame.uniqueName + "].");
        });
        this.eventAggregator.subscribe(environment.canvasSelectedBackmatChanged, backmat => {
            console.log("[FrameCanvas] Backmat changed to [" + backmat.uniqueName + "].");
        });
        this.eventAggregator.subscribe(environment.canvasSelectedBackboardChanged, backboard => {
            console.log("[FrameCanvas] Backboard changed to [" + backboard.uniqueName + "].");
        });
    }
}