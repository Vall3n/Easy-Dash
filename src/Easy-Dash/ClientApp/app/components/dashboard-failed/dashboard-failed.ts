import { HttpClient } from 'aurelia-fetch-client';
import { inject, PLATFORM } from 'aurelia-framework';
import { DashboardResult } from '../models/dashboardresult';
import { TestSummary } from '../models/testsummary';
import { Busy } from '../busy/busy';
import { DialogService } from 'aurelia-dialog';
import * as signalR from '@aspnet/signalr';


@inject(HttpClient, DialogService, Busy)
export class DashboardFailed {
    failedResults: DashboardResult[] = [];
    private hubConnection: signalR.HubConnection;

    constructor(public http: HttpClient, public dialogService: DialogService, private readonly busy: Busy) {

        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/dashboardsignal")
        .configureLogging(signalR.LogLevel.Trace)
        .build();

        this.loadDashboardResults();
        this.hookup();

        this.hubConnection.start().then(() => {
            console.info("Hub started");
        }).catch((reason: any) => {
            console.log("Hub Error", reason);
        });
    }

    deactivate() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }

    private hookup() {
        try {
            this.busy.on();
            
            this.hubConnection.on('TestStarted',
                (id: number) => {
                    const row = this.failedResults.findIndex(result => result.id === id);
                    if (row > -1) {
                        this.failedResults[row].lastStatus = 'Running';
                    }
                });

            this.hubConnection.on('TestEnded',
                (result: DashboardResult) => {
                    this.addOrUpdateDashboardResult(result);
                });


        } catch (e) {
            console.warn('Exception on hookup', e);
        } finally {
            this.busy.off();
        }
    }

    sortResults() {
        this.failedResults.sort((a, b) => {
            return new Date(a.nextUpdate).getTime() - new Date(b.nextUpdate).getTime();
        });
    }

    private async loadDashboardResults() {
        try {
            this.busy.on();
            const result = await this.http.fetch('api/Dashboard/Results');

            const resultdata = await result.json() as DashboardResult[];
            this.failedResults = [];
            resultdata.filter(r => r.lastStatus === 'Fail').map(m => {
                this.addOrUpdateDashboardResult(m);
            });

            this.sortResults();
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

            this.dialogService.open({ viewModel: PLATFORM.moduleName('app/components/dashboard-details/dashboard-details'), model: summaries, lock: false })
                .whenClosed(response => {
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

    private addOrUpdateDashboardResult(result: DashboardResult): void {
        const existingIndex = this.failedResults.findIndex(x => x.id === result.id);
        if (existingIndex > -1) {
            this.failedResults.splice(existingIndex, 1);
        }

        if (result && result.lastStatus === 'Fail') {
            const item = new DashboardResult();

            item.lastUpdate = result.lastUpdate;
            item.description = result.description;
            item.id = result.id;
            item.lastStatus = result.lastStatus;
            item.nextUpdate = result.nextUpdate;

            this.failedResults.unshift(item);
        }
    }
}