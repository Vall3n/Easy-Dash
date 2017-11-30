import { UrlTestStatus } from './urlteststatus';

export class TestSummary {
    summaryDescription: string;
    fromDate: string;
    toDate: string;
    numberOfTests: number;
    successful: number;
    failed: number;
    averageDuration: number;
    source: Array<UrlTestStatus>;
}