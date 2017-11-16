import { PLATFORM_ID, Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection } from '@aspnet/signalr-client';

@Component({
    selector: 'configure',
    templateUrl: './configure.component.html',
    styleUrls: ['./configure.component.css']
})
export class ConfigureComponent {
    public configurations: Configuration[];
    private hubConnection: HubConnection;

    constructor(public http: Http, @Inject('BASE_URL') public baseUrl: string, @Inject(PLATFORM_ID) platformId: string) {
        if (!isPlatformBrowser(platformId))
            return;

        http.get(baseUrl + 'api/Configuration/Urls').subscribe(result => {
            this.configurations = result.json() as Configuration[];

            this.configurations.forEach((item) => {
                this.configureItem(item);
            });
        }, error => console.error(error));
    }

    async ngOnInit() {
        try {
            this.hubConnection = new HubConnection('/dashboardsignal');
            await this.hubConnection.start();
        } catch (e) {
            console.warn('Exception on Init', e);
        }
    }

    public addConfiguration(): void {
        const item: Configuration = new Configuration();

        this.configureItem(item);
        this.configurations.push(item);
    }

    configureItem(item: Configuration) {
         item.save = async () => {
         console.warn("About to save", item);
         this.http.post(this.baseUrl + 'api/configuration/create',item).subscribe(async response => {
          console.warn("save response", response);
          const result = response.json() as Configuration;
          await this.hubConnection.invoke("ConfigAdded", result.id);
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
    schedule: string;
    enabled: boolean;

    save(): void { };
}