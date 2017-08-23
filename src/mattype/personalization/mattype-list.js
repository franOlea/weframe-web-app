import {inject} from 'aurelia-framework';
import {MattypeService} from '../mattype-service';

@inject(MattypeService)
export class MattypeList {
    constructor(mattypeService) {
        this.mattypeService = mattypeService;
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
}