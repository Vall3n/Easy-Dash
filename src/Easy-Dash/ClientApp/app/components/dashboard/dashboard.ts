import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { IDashboardResult } from '../models/models'
import { Busy } from '../app/busy/busy';

@inject(HttpClient, Busy)
export class Dashboard {
    dashboardResults: IDashboardResult[];
    private hubConnection: HubConnection;

    constructor(public http: HttpClient ,private busy: Busy) {
        console.warn("dashoard busy ", busy);

        this.hookup();
    }

    private async hookup() {
        try {
            this.busy.on();
            this.hubConnection = new HubConnection('/dashboardsignal');
            await this.hubConnection.start();

            this.hubConnection.on('TestStarted',
                (id: number) => {
                    let row = this.dashboardResults.findIndex(result => result.id === id);
                    if (row >= 0) {
                        this.dashboardResults[row].lastStatus = 'Running';
                    }
                });

            this.hubConnection.on('TestEnded',
                (result: IDashboardResult) => {
                    let row = this.dashboardResults.findIndex(item => item.id === result.id);
                    if (row >= 0) {
                        const item = this.dashboardResults[row];
                        item.nextUpdate = result.nextUpdate;
                        item.lastStatus = result.lastStatus;
                        item.description = result.description;
                        item.lastUpdate = result.lastUpdate;

                        setTimeout(() => this.sortResults(), 5000);
                    }
                });

            this.hubConnection.on('configAdded',
                (id: number) => {
                    console.warn('New config created', id);
                    this.addDashboardResult(id);
                });

            this.loadDashboardResults();

        } catch (e) {
            console.warn('Exception on Init', e);
        } finally {
            this.busy.off();
        }
    }

    getRowStyle(item: IDashboardResult): string {

        switch (item.lastStatus) {
            case 'Pending':
                return 'bg-info';
            case 'Fail':
                return 'bg-danger';
            case 'Success':
                return 'bg-success';
            case 'Running':
                return 'bg-active';
            default:
                return '';
        }
    }

    configureItem(item: IDashboardResult) {
        const intervalHandle = setInterval(() => {
            if (new Date(item.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
                clearInterval(intervalHandle);
                item.lastStatus = 'Pending';
            }
        },
            1000);

        item.friendlyNextUpdate = () => {
            if (new Date(item.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
                return 'Awaiting results..';
            }

            return moment(item.nextUpdate).fromNow();
        }

        item.friendlyLastUpdated = () => {
            try {
                const m = moment(item.lastUpdate);
                return m.fromNow();
            } catch (e) {
                console.warn(e);
            }
            return 'oops';
        }
    }

    sortResults() {
        this.dashboardResults.sort((a, b) => {
            return new Date(a.nextUpdate).getTime() - new Date(b.nextUpdate).getTime();
        });
    }

    private async loadDashboardResults() {
        try {
            this.busy.on();
            const result = await this.http.fetch('api/Dashboard/Results');
            console.warn("result is", result);

            const resultdata = await result.json();
            this.dashboardResults = resultdata as IDashboardResult[];

            this.dashboardResults.forEach((item) => {
                this.configureItem(item);

                this.sortResults();
            });
        } catch (error) {
            console.error(error);
        } finally {
            this.busy.off();
        }
    }


    private async addDashboardResult(id: number) {
        try {
            const response = await this.http.fetch('api/Dashboard/Find/' + id);
            const result = await response.json() as IDashboardResult;

            if (result) {
                this.dashboardResults.push(result);
                this.configureItem(result);
                this.sortResults();
            }
        } catch (error) {
            console.error(error);
        }
    }
}


