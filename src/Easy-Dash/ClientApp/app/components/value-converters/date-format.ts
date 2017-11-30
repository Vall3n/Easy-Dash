import * as moment from 'moment';

export class DateFormatValueConverter {
    toView(value: string) {
        return moment(value).format('YYYY/MM/DD');
    }
}