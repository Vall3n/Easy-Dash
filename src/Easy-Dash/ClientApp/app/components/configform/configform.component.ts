import { PLATFORM_ID, Component, Inject, ViewContainerRef, ComponentRef } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection } from '@aspnet/signalr-client';
import { SweetAlertService } from 'angular-sweetalert-service';
import { ModalDialogService, IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog'; 



@Component({
    selector: 'app-config-form',
    templateUrl: './configform.component.html',
    styleUrls: ['./configform.component.css']

})
export class ConfigFormComponent implements IModalDialog {

    actionButtons: IModalDialogButton[]; 
    config: Configuration | null = null;

    constructor(public http: Http,
        @Inject('BASE_URL') public baseUrl: string,
        @Inject(PLATFORM_ID) platformId: string,
        private swal: SweetAlertService,
        modalService: ModalDialogService, viewRef: ViewContainerRef) {

        this.actionButtons = [
            {
                text: 'Save',
                onAction: async () => {
                    if (this.config) {
                        await this.config.save();
                        return true;
                    };
                    return true;
                }
            },
            {
                text: 'Close',
                onAction: () => true
            }
        ];

    }

    ngOnInit() {
        try {

            //this.hubConnection = new HubConnection('/dashboardsignal');
            //await this.hubConnection.start();
        } catch (e) {
            console.warn('Exception on Init', e);
        }
    }

    dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions): void {
        if (options && options.data) {
            this.config = options.data;
        }
    }
}

class Configuration {
    id: number;
    description: string;
    url: string;
    statusCode?: number;
    bodyContains?: string;
    scheduleTime: string;
    enabled: boolean;
    scheduleTimeSpan: string;
    save(): void { };
}