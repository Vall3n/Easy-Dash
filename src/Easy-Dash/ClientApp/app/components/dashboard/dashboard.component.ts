import { PLATFORM_ID, Component, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { isPlatformBrowser } from "@angular/common";
import * as moment from "moment";
import { HubConnection } from "@aspnet/signalr-client";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {
    public dashboardResults: IDashboardResult[];
    private hubConnection: HubConnection;

    constructor(public http: Http, @Inject("BASE_URL") public baseUrl: string, @Inject(PLATFORM_ID) platformId: string) {
        if (!isPlatformBrowser(platformId))
            return;

            this.loadDashboardResults();
    }

    async ngOnInit() {

        try {
            this.hubConnection = new HubConnection("/dashboardsignal");
            await this.hubConnection.start();

            this.hubConnection.on("TestStarted", (id: number) => {
                let row = this.dashboardResults.findIndex(result => result.id === id);
                if (row >= 0) {
                    this.dashboardResults[row].lastStatus = "Running";
                }
            });

            this.hubConnection.on("TestEnded", (result: IDashboardResult) => {
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

            this.hubConnection.on("configAdded", (id: number) => {
                console.warn("New config created", id);
                this.addDashboardResult(id);
            });

        } catch (e) {
            console.warn("Exception on Init", e);
        }
    }

    getRowStyle(item: IDashboardResult): string {

        switch (item.lastStatus) {
            case "Pending":
                return "bg-info";
            case "Fail":
                return "bg-danger";
            case "Success":
                return "bg-success";
            case "Running":
                return "bg-active";
            default:
                return "";
        }
    }

    configureItem(item: IDashboardResult) {
        const intervalHandle = setInterval(() => {
            if (new Date(item.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
                clearInterval(intervalHandle);
                item.lastStatus = "Pending";
            }
        }, 1000);

        item.friendlyNextUpdate = () => {
            if (new Date(item.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
                return "Awaiting results..";
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
            return "oops";
        }
    }

    sortResults() {
        this.dashboardResults.sort((a, b) => {
            return new Date(a.nextUpdate).getTime() - new Date(b.nextUpdate).getTime();
        });
    }

    private loadDashboardResults() {
        this.http.get(this.baseUrl + "api/Dashboard/Results").subscribe(result => {
            this.dashboardResults = result.json() as IDashboardResult[];

            this.dashboardResults.forEach((item) => {
                this.configureItem(item);

                this.sortResults();
            });
        }, error => console.error(error));
    }

    private addDashboardResult(id: number) {
        this.http.get(this.baseUrl + "api/Dashboard/Find/" + id).subscribe(response => {
            const result = response.json() as IDashboardResult;

        if (result) {
            this.dashboardResults.push(result);
            this.configureItem(result);
            this.sortResults();
        }
        }, error => console.error(error));
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
