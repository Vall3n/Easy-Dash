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
}

export interface IDashboardResult {
    id: number;
    description: string;
    lastStatus: string;
    lastUpdate: string;
    nextUpdate: string;
    friendlyNextUpdate(): string;
    friendlyLastUpdated(): string;
}