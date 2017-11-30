import { bindable, bindingMode } from 'aurelia-framework';

export class DurationPicker {

    regex: RegExp = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d+[HMS])(\d+H)?(\d+M)?(\d+S)?)?$/;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value: string | null;

    private _years = 0;
    private _months = 0;
    private _weeks = 0;
    private _days = 0;
    private _hours = 0;
    private _minutes = 0;
    private _seconds = 0;

    config = {
        showButtons: true,
        showPreview: false,
        showLetters: true,
        showYears: false,
        showMonths: false,
        showWeeks: false,
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: false,
    };

    get years() { return this._years; }
    set years(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._years = value;
        this.emitNewValue();
    }

    get months() { return this._months; }
    set months(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._months = value;
        this.emitNewValue();
    }

    get weeks() { return this._weeks; }
    set weeks(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._weeks = value;
        this.emitNewValue();
    }

    get days() { return this._days; }
    set days(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._days = value;
        this.emitNewValue();
    }

    get hours() { return this._hours; }
    set hours(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._hours = value;
        this.emitNewValue();
    }

    get minutes() { return this._minutes; }
    set minutes(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._minutes = value;
        this.emitNewValue();
    }

    get seconds() { return this._seconds; }
    set seconds(value) {
        value = this.parseNumber(value) > 0 ? value : 0;
        this._seconds = value;
        this.emitNewValue();
    }

    bind(bindingContext: any, overrideContext: any) { 
        this.parse();
    }

    parse() {
        if (!this.value) {
            return;
        }

        const match = this.regex.exec(this.value);

        if (!match) {
            console.error(`DurationPicker: invalid initial value: ${this.value}`);
            return;
        }

        this._years = this.parseNumber(match[1]);
        this._months = this.parseNumber(match[2]);
        this._weeks = this.parseNumber(match[3]);
        this._days = this.parseNumber(match[4]);
        this._hours = this.parseNumber(match[6]);
        this._minutes = this.parseNumber(match[7]);
        this._seconds = this.parseNumber(match[8]);
    }

    parseNumber(value: number | string | null): number {
        return value ? parseInt(value.toString(), 10) : 0;
    }

    generate(): string | null {
        let output: string | null = 'P';

        if (this.config.showYears && this.years) {
            output += `${this.years}Y`;
        }
        if (this.config.showMonths && this.months) {
            output += `${this.months}M`;
        }
        if (this.config.showWeeks && this.weeks) {
            output += `${this.weeks}W`;
        }
        if (this.config.showDays && this.days) {
            output += `${this.days}D`;
        }
        if (
            (this.config.showHours && this.hours)
            || (this.config.showMinutes && this.minutes)
            || (this.config.showSeconds && this.seconds)
        ) {
            output += 'T';

            if (this.config.showHours && this.hours) {
                output += `${this.hours}H`;
            }
            if (this.config.showMinutes && this.minutes) {
                output += `${this.minutes}M`;
            }
            if (this.config.showSeconds && this.seconds) {
                output += `${this.seconds}S`;
            }
        }

        // if all values are empty, just output null
        if (output === 'P') {
            output = null;
        }

        return output;
    }

    emitNewValue() {
        this.value = this.generate();
    }

    // Attach all the changes received in the options object
    attachChanges(options: any): void {
        Object.keys(options).forEach(param => {
            if (this.config.hasOwnProperty(param)) {
                // (this.config)[param] = options[param];
            }
        });
    }
}
