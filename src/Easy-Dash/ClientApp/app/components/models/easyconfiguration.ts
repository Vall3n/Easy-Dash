
export class EasyConfiguration {
    id: number = 0;
    description: string = '';
    url: string = '';
    statusCode: number = 200;
    bodyContains: string = '';
    scheduleTime: number = 5;
    enabled: boolean = true;
    save() { }
}