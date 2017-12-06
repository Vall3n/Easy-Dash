import { HttpClient } from 'aurelia-fetch-client';
import { inject, PLATFORM } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { DashboardResult } from '../models/dashboardresult';
import { TestSummary } from '../models/testsummary';
import { Busy } from '../busy/busy';
import { Dashboard } from '../dashboard/dashboard';
import { DialogService } from 'aurelia-dialog';

@inject(HttpClient, DialogService, Busy)
export class DashboardCards extends Dashboard {
    constructor(http: HttpClient, dialogService: DialogService, busy: Busy) {
        super(http, dialogService, busy);
        }
}