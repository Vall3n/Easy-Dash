import { HttpClient, json } from 'aurelia-fetch-client';
import { inject, NewInstance } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EasyConfiguration as EasyConfiguration } from '../models/easyconfiguration'
import { UrlTestStatus } from '../models/urlteststatus';

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


    testResult: UrlTestStatus;
    test = async () => {
        try {
            //this.busy.on();
            const response = await this.http.fetch('api/configuration/test',
                {
                    method: 'post',
                    body: json(this.config)
                });

            this.testResult = await response.json() as UrlTestStatus;
        } catch (e) {
            console.error(e);
        } finally {
            //this.busy.off();
        }
    }

    constructor(public http: HttpClient, public controller: DialogController) {

    }

    activate(config: EasyConfiguration) {
        this.config = config;
    }
}
