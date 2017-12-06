import { HttpClient } from 'aurelia-fetch-client';
import { inject, PLATFORM } from 'aurelia-framework';
import * as moment from 'moment';
import { HubConnection } from '@aspnet/signalr-client';
import { DashboardResult } from '../models/dashboardresult';
import { TestSummary } from '../models/testsummary';
import { Busy } from '../busy/busy';
import { DialogService } from 'aurelia-dialog';

@inject(HttpClient, DialogService, Busy)
export class DashboardCards {
    dashboardResults: DashboardResult[];
    private hubConnection: HubConnection;

    constructor(public http: HttpClient, public dialogService: DialogService, private busy: Busy) {
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
                (result: DashboardResult) => {
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

    configureItem(item: DashboardResult) {
        const intervalHandle = setInterval(() => {
            if (new Date(item.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
                clearInterval(intervalHandle);
                item.lastStatus = 'Pending';
            }
        }, 1000);
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

            const resultdata = await result.json() as DashboardResult[];
            this.dashboardResults = resultdata.map(m => {
                const item = new DashboardResult();

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

    async detailsClick(id: number) {

        try {
            this.busy.on();
            const response = await this.http.fetch(`api/Dashboard/${id}/details`);
            const summaries = await response.json() as TestSummary[];

            this.busy.off();

            console.warn("Open dialog", summaries);
            this.dialogService.open({ viewModel: PLATFORM.moduleName('app/components/dashboard-details/dashboard-details') , model: summaries, lock: false }).whenClosed(
                response => {
                    if (response.wasCancelled) {
                        return;
                    }
                });
        } catch (e) {
            console.error(e);
        } finally {
            this.busy.off();
        }
    }

    private async addOrUpdateDashboardResult(id: number) {
        try {
            const response = await this.http.fetch('api/Dashboard/Find/' + id);
            const result = await response.json() as DashboardResult;

            if (result) {

                const existing = this.dashboardResults.find(x => x.id === id);
  
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