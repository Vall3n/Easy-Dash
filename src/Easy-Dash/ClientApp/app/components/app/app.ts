import { Aurelia, PLATFORM, inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Busy } from '../busy/busy';

@inject(Busy)
export class App {
    router: Router;
    constructor(public busy: Busy) {
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'easydash';
        config.map([{
            route: ['','dashboard'],
            name: 'dashboard',
            settings: { icon: 'fa-th-large' },
            moduleId: PLATFORM.moduleName('../dashboard/dashboard'),
            nav: true,
            title: 'Dashboard'
        },{
            route: 'cardview',
            name: 'cardview',
            settings: { icon: 'fa-vcard-o' },
            moduleId: PLATFORM.moduleName('../dashboard-cardview/dashboard-cardview'),
            nav: true,
            title: 'Card View'
        },{
            route: 'configure',
            name: 'configure',
            settings: { icon: 'fa-cogs' },
            moduleId: PLATFORM.moduleName('../configure/configure'),
            nav: true,
            title: 'Configure'
        }]);

        this.router = router;
    }
}
