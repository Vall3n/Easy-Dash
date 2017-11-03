import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';


@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    public dashboardResults: IDashboardResult[];


    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/SampleData/DashboardResults').subscribe(result => {
            this.dashboardResults = result.json() as IDashboardResult[];

            this.dashboardResults.forEach((item) => {
                this.configureItem(item);

                this.sortResults();
            });
        }, error => console.error(error));
    }

    configureItem(item: IDashboardResult) {
        item.nextUpdateSeconds = Math.round(((new Date(item.nextUpdate).getTime() - new Date(Date.now()).getTime()) / 1000));
        const intervalHandle = setInterval(() => {
            item.nextUpdateSeconds = item.nextUpdateSeconds - 1;

            if (item.nextUpdateSeconds < 1) {
                clearInterval(intervalHandle);
                item.lastStatus = "Pending";
            }
        }, 1000);

        item.friendlyNextUpdate = () => {
            return moment(item.nextUpdate).fromNow();
        }

        item.friendlyLastUpdated = () => {
            return moment(item.lastUpdate).fromNow();
        }        
    }

    sortResults() {
        this.dashboardResults.sort((a, b) => {
            if (a.nextUpdateSeconds < b.nextUpdateSeconds)
                return -1;

            if (a.nextUpdateSeconds > b.nextUpdateSeconds)
                return 1;

            return 0;
        });
    }
}

interface IDashboardResult {
    description: string;
    lastStatus: string;
    lastUpdate: Date;
    nextUpdate: Date;
    nextUpdateSeconds: number;
    friendlyNextUpdate(): string;
    friendlyLastUpdated(): string;
}