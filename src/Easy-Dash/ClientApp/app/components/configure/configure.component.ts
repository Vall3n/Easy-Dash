import { PLATFORM_ID, Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'configure',
    templateUrl: './configure.component.html',
    styleUrls: ['./configure.component.css']
})
export class ConfigureComponent {
    public configurations: Configuration[];

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, @Inject(PLATFORM_ID) platformId: string) {
        if (!isPlatformBrowser(platformId))
            return;

        http.get(baseUrl + 'api/SampleData/Configurations').subscribe(result => {
            this.configurations = result.json() as Configuration[];

            this.configurations.forEach((item) => {
                this.configureItem(item);
            });
        }, error => console.error(error));
    }

    public addConfiguration(): void {
        const item: Configuration = new Configuration();

        this.configureItem(item);
        this.configurations.push(item);
    }

    configureItem(item: Configuration) {
        item.save = () => {
            alert('Saved ' + item.description);
        };
    }
}

class Configuration {
    id: number;
    description: string;
    url: string;
    statusCode?: number;
    containsText?: string;

    save(): void { };
}