import { PLATFORM_ID, Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    public dashboardResults: IDashboardResult[];


    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, @Inject(PLATFORM_ID) platformId: string) {
        if (!isPlatformBrowser(platformId))
            return;

        http.get(baseUrl + 'api/Dashboard/Results').subscribe(result => {
            this.dashboardResults = result.json() as IDashboardResult[];

            this.dashboardResults.forEach((item) => {
                this.configureItem(item);

                this.sortResults();
            });
        }, error => console.error(error));
    }

    getRowStyle(item: IDashboardResult): string {
        switch (item.lastStatus) {
            case 'Pending':
                return 'info';
            case 'Fail':
                return 'danger';
            case 'Success':
                return 'success';
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
        }, 1000);

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
}

interface IDashboardResult {
    id: number;
    description: string;
    lastStatus: string;
    lastUpdate: string;
    nextUpdate: string;
    friendlyNextUpdate(): string;
    friendlyLastUpdated(): string;
}
