import { inject } from 'aurelia-framework';
import {  TestSummary } from '../models/testsummary'
import { DialogController } from 'aurelia-dialog';  

@inject(DialogController, Element)
export class DashboardDetails {

    summaries: TestSummary[] = [];

    constructor(public controller: DialogController,private element: Element) {

    }

    activate(summaries: Array<TestSummary>) {
        this.summaries = summaries;
    }

    attached() {
    }
}

