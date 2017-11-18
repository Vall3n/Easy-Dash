import { PLATFORM_ID, Component, Inject, ViewContainerRef } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection } from '@aspnet/signalr-client';
import { SweetAlertService } from 'angular-sweetalert-service';
import { ConfigFormComponent } from '../configform/configform.component';
import { ModalDialogService } from 'ngx-modal-dialog';  

@Component({
    selector: 'configure',
    templateUrl: './configure.component.html',
    styleUrls: ['./configure.component.css']
    
})
export class ConfigureComponent {
    public configurations: Configuration[];
    private hubConnection: HubConnection;
    

    constructor(public http: Http,
        @Inject('BASE_URL') public baseUrl: string,
        @Inject(PLATFORM_ID) platformId: string,
        private swal: SweetAlertService,
        private modalService: ModalDialogService, private viewRef: ViewContainerRef) {
        if (!isPlatformBrowser(platformId))
            return;

        this.loadData();
    }

    async ngOnInit() {
        try {
            
            this.hubConnection = new HubConnection('/dashboardsignal');
            await this.hubConnection.start();
        } catch (e) {
            console.warn('Exception on Init', e);
        }
    }

    editClick(id: number) {

        const row: Configuration | undefined = this.configurations.find(conf => {
            return conf.id === id;
        });
         
        if (row) {
            this.modalService.openDialog(this.viewRef,
                {
                    title: 'Edit Configuration',
                    childComponent: ConfigFormComponent,
                    data: row
                });
        }
    }

    private loadData() {

        this.configurations = [];

        this.http.get(this.baseUrl + 'api/Configuration/Urls').subscribe(result => {
            this.configurations = result.json() as Configuration[];

            this.configurations.forEach((item) => {
                this.configureItem(item);
            });
            
        }, error => console.error(error));
    }

    addConfiguration(): void {
        const item: Configuration = new Configuration();
        this.configureItem(item);
        this.modalService.openDialog(this.viewRef,
            {
                title: 'Add Configuration',
                childComponent: ConfigFormComponent,
                data: item,
                onClose: () => {
                    console.warn("OnClose", item)
                    this.configurations.push(item);
                    return true;
                }
            });

    }

    deleteConfiguration(id: number) {

        this.swal.confirm({
            title: 'Delete configruation',
            text: 'Are you sure you want to delete this configuration?',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            this.http.delete(this.baseUrl + 'api/configuration/delete/' + id)
                .subscribe(async response => {
                    const result = response.json() as boolean;
                    if (result) {
                        this.swal.success({
                            title: 'Deleted',
                            text: 'That data is gone, gone, gone!',
                            timer: 3000 });
                        this.loadData();
                    } else {
                        this.swal.error({
                            title: 'Oops',
                            text: 'That did not work'
                        });
                    }
                });
        })
            .catch(() => { });
    }

    configureItem(item: Configuration) {
        item.save = async () => {
            return this.http.post(this.baseUrl + 'api/configuration/save', item).subscribe(async response => {
                const result = response.json() as Configuration;
                //await this.hubConnection.invoke("ConfigAdded", result.id);

                item.id = result.id;
                item.scheduleTimeSpan = result.scheduleTimeSpan;

                 await this.swal.success({
                    title: 'Saved',
                    text: 'Yeah baby, that config has been secured.'
                });
                return true;
            }, error => console.error(error));
            
        };
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