import {bindable} from 'aurelia-framework';

export class FrameThumbnail {

    @bindable frame;

    constructor() {
    }

    created() {
    }
    
    attached() {
        
    }

    setHasLoaded() {
        this.hasLoaded = true;
    }

}