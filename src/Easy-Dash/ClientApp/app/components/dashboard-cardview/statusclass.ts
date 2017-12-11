export class StatusClassValueConverter {
    toView(status: string) {
        switch (status) {
            case 'Pending':
                return 'bg-info';
            case 'Fail':
                return 'bg-danger';
            case 'Success':
                return 'bg-success';
            case 'Running':
                return 'bg-active';
            default:
                return '';
        }
    }
}