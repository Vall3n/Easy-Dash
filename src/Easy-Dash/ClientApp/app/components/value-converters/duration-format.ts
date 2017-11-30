export class DurationFormatValueConverter {
    toView(value: number) {
        return value.toFixed(2);
    }
}