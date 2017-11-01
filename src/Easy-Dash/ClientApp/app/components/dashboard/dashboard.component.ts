import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

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
                this.setTimer(item);

                this.sortResults();
            });
        }, error => console.error(error));
    }

    setTimer(item: IDashboardResult) {
        item.nextUpdateSeconds = Math.round(((new Date(item.nextUpdate).getTime() - new Date(Date.now()).getTime()) / 1000));
        const intervalHandle = setInterval(() => {
            item.nextUpdateSeconds = item.nextUpdateSeconds - 1;

            if (item.nextUpdateSeconds < 1) {
                clearInterval(intervalHandle);
                item.lastStatus = "Pending";
            }
        }, 1000);
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
}
