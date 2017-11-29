export class StatusClassValueConverter {
    toView(status: string) {
        switch (status) {
            case 'Pending':
                return 'table-info';
            case 'Fail':
                return 'table-danger';
            case 'Success':
                return 'table-success';
            case 'Running':
                return 'table-active';
            default:
                return '';
        }
    }
}