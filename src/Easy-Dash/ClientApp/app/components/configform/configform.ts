import { HttpClient } from 'aurelia-fetch-client';
import { inject, NewInstance } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Configuration } from '../models/models'

@inject(HttpClient, DialogController)
export class ConfigForm {
    
    config: Configuration;

    constructor(public http: HttpClient, public controller: DialogController) {
           
    }

    activate(config: Configuration) {
        this.config = config;
    }
}
