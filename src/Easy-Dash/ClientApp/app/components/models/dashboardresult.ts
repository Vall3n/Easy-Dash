import { computedFrom } from 'aurelia-framework';
import * as moment from 'moment';

export class DashboardResult {

    constructor() {
        setInterval(() => { this.currentDateTime = Date.now() }, 1000);
    }

    id: number;
    description: string;
    lastStatus: string;
    lastUpdate: string;
    nextUpdate: string;
    
    @computedFrom("nextUpdate","currentDateTime")
    get friendlyNextUpdate(): string {
        if (new Date(this.nextUpdate).getTime() < new Date(this.currentDateTime).getTime()) {
            return 'Awaiting results..';
        }

        return moment(this.nextUpdate).fromNow();
    };

    @computedFrom("lastUpdate", "currentDateTime")
    get friendlyLastUpdated(): string {
        try {
            const m = moment(this.lastUpdate);
            return m.fromNow();
        } catch (e) {
            console.warn(e);
        }
        return 'oops';
    }

    private currentDateTime: number;
}