import * as moment from 'moment';

export class DurationFormatValueConverter {
    toView(value: string) {
        return value.replace('00:00:', '').substr(0,6) + ' sec';
    }
}