import { HttpClient } from 'aurelia-fetch-client';
import { inject, NewInstance } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EasyConfiguration as EasyConfiguration } from '../models/easyconfiguration'

@inject(HttpClient, DialogController)
export class ConfigForm {

    config: EasyConfiguration;
    minutes = [
        { id: 1, name: '1' },
        { id: 5, name: '5' },
        { id: 10, name: '10' },
        { id: 15, name: '15' },
        { id: 20, name: '20' },
        { id: 30, name: '30' }
    ];
    selectedTime: number = 15;

    constructor(public http: HttpClient, public controller: DialogController) {

    }

    activate(config: EasyConfiguration) {
        this.config = config;
    }
}
