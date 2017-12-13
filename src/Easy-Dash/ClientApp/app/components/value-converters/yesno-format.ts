export class YesNoValueConverter {
    toView(value: boolean) {
            return value ? 'Yes' : 'No';
    }
}