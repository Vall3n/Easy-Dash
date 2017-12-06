export class LongTextValueConverter {
    toView(text: string, length: number) {
        if (!length) {
            length = 30;
        }
        if (text)
            return text.length <= length ? text : text.substr(0, length) + '...';

        return '';
    } 
}