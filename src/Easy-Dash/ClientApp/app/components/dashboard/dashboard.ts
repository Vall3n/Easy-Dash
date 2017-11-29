import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { IDashboardResult } from '../models/models'
import { Busy } from '../busy/busy';


@inject(HttpClient, Busy)
export class Dashboard {
    dashboardResults: IDashboardResult[];
    private hubConnection: HubConnection;

    constructor(public http: HttpClient ,private busy: Busy) {

        this.loadDashboardResults();

    }

    async activate(): Promise<void> {
        try {
            this.busy.on();
            return await this.hookup();
        } catch (e) {

        } finally {
            this.busy.off();
        }
    }

    deactivate() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }

    private async hookup() {
        try {
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

                        this.configureItem(item);

                        setTimeout(() => this.sortResults(), 5000);
                    }
                });

            this.hubConnection.on('ConfigModified',
                (id: number) => {
                    this.addOrUpdateDashboardResult(id);
                });

            return;

        } catch (e) {
            console.warn('Exception on Init', e);
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

            const resultdata = await result.json() as IDashboardResult[];
            this.dashboardResults = resultdata.map(m => {
                const item = new IDashboardResult();

                item.lastUpdate = m.lastUpdate;
                item.description = m.description;
                item.id = m.id;
                item.lastStatus = m.lastStatus;
                item.nextUpdate = m.nextUpdate;

                return item;
            });

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
    
    private async addOrUpdateDashboardResult(id: number) {
        try {
            const response = await this.http.fetch('api/Dashboard/Find/' + id);
            const result = await response.json() as IDashboardResult;

            if (result) {

                const existing = this.dashboardResults.find(x => x.id === id);
                console.warn("EXI",  existing)
                if (existing) {
                    existing.description = result.description;
                    existing.nextUpdate = result.nextUpdate;
                    existing.lastUpdate = result.lastUpdate;
                    this.configureItem(existing);
                } else {
                    this.dashboardResults.push(result);
                    this.configureItem(result);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

}


