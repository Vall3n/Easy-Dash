import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { UrlTestStatus, TestSummary } from '../models/models'
import { Busy } from '../busy/busy';
import { DialogController } from 'aurelia-dialog';  

@inject(HttpClient, Busy, DialogController)
export class DashboardDetails {

    summaries: TestSummary[];

    constructor(private http: HttpClient, private busy: Busy, public controller: DialogController) {

    }

    async activate(summaries: Array<TestSummary>) {
        this.summaries = summaries;
    }

}