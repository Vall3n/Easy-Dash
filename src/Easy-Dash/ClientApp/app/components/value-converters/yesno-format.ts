export class YesNoValueConverter {
    toView(value: boolean) {
        if (value)
            return value ? 'Yes' : 'No';

        return '';
    }
}