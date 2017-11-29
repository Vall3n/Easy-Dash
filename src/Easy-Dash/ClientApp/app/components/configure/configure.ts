import { HttpClient, json } from 'aurelia-fetch-client';
import { inject, NewInstance } from 'aurelia-framework';
import { HubConnection } from '@aspnet/signalr-client';
import { DialogService } from 'aurelia-dialog';
import { ConfigForm } from '../configform/configform'
import * as SweetAlert from 'sweetalert2';
import { Configuration } from '../models/models'
import { Busy } from '../busy/busy';

@inject(HttpClient, DialogService, Busy)
export class Configure {

    configurations: Configuration[];
    loading = false;
    private hubConnection: HubConnection;


    constructor(public http: HttpClient, public dialogService: DialogService, private busy: Busy) {
        this.loadData();
    }

    async activate() {
        try {
            this.busy.on();
            this.hubConnection = new HubConnection('/dashboardsignal');
            await this.hubConnection.start();
        } catch (e) {

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
            this.configurations = (await result.json()) as Configuration[];

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

            const row: Configuration | undefined = this.configurations.find(conf => {
                return conf.id === id;
            });

            if (row) {


                this.dialogService.open({ viewModel: ConfigForm, model: row, lock: true }).whenClosed(response => {
                    if (response.wasCancelled) {
                        return;
                    }

                    (response.output as Configuration).save();
                });
            }

        } catch (error) {
            console.error(error);
        } 
    }

    addConfiguration() {
        const item = new Configuration();

        item.enabled = true;
        item.statusCode = 200;
        item.scheduleTime = 'PT5M';

        this.configureItem(item);

        try {
            this.dialogService.open({ viewModel: ConfigForm, model: item, lock: true }).whenClosed(response => {
                if (response.wasCancelled)
                    return;

                (response.output as Configuration).save();

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

                    await SweetAlert.default({
                        title: 'Deleted',
                        text: 'That data is gone, gone, gone!',
                        type: 'success',
                        showCancelButton: false,
                        timer: 2500
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

    async configureItem(item: Configuration) {
        item.save = async () => {
            const isNewRecord = !item.id;
            try {
                this.busy.on();
                const response = await this.http.fetch('api/configuration/save',
                    {
                        method: 'post',
                        body: json(item)
                    });

                const result = await response.json() as Configuration;
                await this.hubConnection.invoke('ConfigModified', result.id);

                item.id = result.id;
                item.scheduleTimeSpan = result.scheduleTimeSpan;

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
