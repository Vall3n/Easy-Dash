import { UrlTestStatus } from './urlteststatus';

export class TestSummary {
    summaryDescription: string = '';
    fromDate: string | Date = '';
    toDate: string | Date = '';
    numberOfTests: number = 0;
    successful: number = 0;
    failed: number = 0;
    averageDuration: number = 0;
    source: Array<UrlTestStatus> = [];
}