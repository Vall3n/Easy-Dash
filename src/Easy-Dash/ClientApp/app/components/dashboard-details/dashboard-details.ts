import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { UrlTestStatus } from '../models/models'
import { Busy } from '../busy/busy';
import { DialogController } from 'aurelia-dialog';  

@inject(HttpClient, Busy, DialogController)
export class DashboardDetails {

    testStatuses: UrlTestStatus[];

    constructor(private http: HttpClient, private busy: Busy, public controller: DialogController) {

    }

    async activate(testStatuses: Array<UrlTestStatus>) {
        this.testStatuses = testStatuses;
    }

}