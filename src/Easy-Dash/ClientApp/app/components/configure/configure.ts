import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { ConfigForm } from '../configform/configform'
import * as SweetAlert from 'sweetalert2';
import { EasyConfiguration as EasyConfiguration } from '../models/easyconfiguration'
import { Busy } from '../busy/busy';
import * as signalR from '@aspnet/signalr';

@inject(HttpClient, DialogService, Busy)
export class Configure {

    configurations: EasyConfiguration[] = [];
    loading = false;
    private hubConnection: signalR.HubConnection;


    constructor(public http: HttpClient, public dialogService: DialogService, private busy: Busy) {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/dashboardsignal")
        .configureLogging(signalR.LogLevel.Trace)
        .build();
            
        this.hubConnection.start().then(() => {
            console.info("Hub started");
        }).catch((reason: any) => {
            console.log("Hub Error", reason);
        });
        this.loadData();
    }

    async activate() {
        try {
            this.busy.on();


        } catch (e) {
            console.log("Hub connection error", e);
        } finally {
            this.busy.off();
        }
    }

    deactivate() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }

    private async loadData() {
        try {
            this.loading = true;
            this.busy.on();
            this.configurations = [];

            const result = await this.http.fetch('api/Configuration/Urls');
            this.configurations = (await result.json()) as EasyConfiguration[];

            this.configurations.forEach((item) => {
                this.configureItem(item);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.busy.off();
            this.loading = false;
        }
    }

    editClick(id: number) {

        try {
            const row: EasyConfiguration | undefined = this.configurations.find(conf => {
                return conf.id === id;
            });

            if (row) {

                this.dialogService.open({ viewModel: ConfigForm, model: row, lock: true }).whenClosed(response => {
                    if (response.wasCancelled) {
                        return;
                    }

                    (response.output as EasyConfiguration).save();
                });
            }

        } catch (error) {
            console.error(error);
        } 
    }

    addConfiguration() {
        const item = new EasyConfiguration();

        item.enabled = true;
        item.statusCode = 200;
        item.scheduleTime = 5;

        this.configureItem(item);

        try {
            this.dialogService.open({ viewModel: ConfigForm, model: item, lock: true }).whenClosed(response => {
                if (response.wasCancelled)
                    return;

                (response.output as EasyConfiguration).save();

            });
        } catch (error) {
            console.error(error);
        } 
    }

    async deleteConfiguration(id: number) {

        const row = this.configurations.find(conf => {
            return conf.id === id;
        });

        if (!row) return;

        const response = await SweetAlert.default({
            title: 'Delete configruation',
            text: 'Are you sure you want to delete this configuration?',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (response.value) {
            try {
                const deletestatus = await this.http.fetch(`api/configuration/delete/${id}`,
                    {
                        method: 'delete'
                    });

                if (deletestatus.status === 200) {

                    this.hubConnection.invoke("ConfigRemoved", id);

                    await SweetAlert.default({
                        title: 'Deleted',
                        text: 'That data is gone, gone, gone!',
                        type: 'success',
                        showCancelButton: false,
                        timer: 1500
                    });

                    const index = this.configurations.indexOf(row);

                    if (index >= 0) {
                        this.configurations.splice(index, 1);
                    }
                } else {
                    throw new Error("delete failed");
                }

            } catch (e) {
                await SweetAlert.default({
                    title: 'Oops',
                    text: 'That dit not work. ',
                    type: 'error',
                    showCancelButton: false
                });
            }
        }
    }

    async configureItem(item: EasyConfiguration) {
        item.save = async () => {
            const isNewRecord = !item.id;
            try {
                this.busy.on();
                const response = await this.http.fetch('api/configuration/save',
                    {
                        method: 'post',
                        body: json(item)
                    });

                const result = await response.json() as EasyConfiguration;
                await this.hubConnection.invoke('ConfigModified', result.id);

                item.id = result.id;

                if (isNewRecord) {
                    this.configurations.push(item);
                }
                this.busy.off();
                await SweetAlert.default({
                    title: 'Saved',
                    text: 'Yeah baby, that config has been secured.',
                    type: 'success',
                    showCancelButton: false,
                    timer: 2500
                });
            } catch (e) {
                console.error(e);
            } finally {
                this.busy.off();
            }
        }
    }
}
