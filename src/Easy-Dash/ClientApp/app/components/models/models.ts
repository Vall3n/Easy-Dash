import { computedFrom } from 'aurelia-framework';
import * as moment from 'moment';

export class Configuration {
    id: number;
    description: string;
    url: string;
    statusCode?: number;
    bodyContains?: string;
    scheduleTime: string;
    enabled: boolean;
    scheduleTimeSpan: string;
    save(): void { };
//    refresh(): void { };
}

export class IDashboardResult {
    id: number;
    description: string;
    lastStatus: string;
    lastUpdate: string;
    nextUpdate: string;

    @computedFrom("nextUpdate")
    get friendlyNextUpdate(): string {
        if (new Date(this.nextUpdate).getTime() < new Date(Date.now()).getTime()) {
            return 'Awaiting results..';
        }

        return moment(this.nextUpdate).fromNow();
    };

    @computedFrom("lastUpdate")
    get friendlyLastUpdated(): string {
        try {
            const m = moment(this.lastUpdate);
            return m.fromNow();
        } catch (e) {
            console.warn(e);
        }
        return 'oops';
    }
}