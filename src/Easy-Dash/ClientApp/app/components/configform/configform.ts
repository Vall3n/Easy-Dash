import { HttpClient } from 'aurelia-fetch-client';
import { inject, NewInstance } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EasyConfiguration as EasyConfiguration } from '../models/easyconfiguration'

@inject(HttpClient, DialogController)
export class ConfigForm {
    
    config: EasyConfiguration;

    constructor(public http: HttpClient, public controller: DialogController) {
           
    }

    activate(config: EasyConfiguration) {
        this.config = config;
    }
}
