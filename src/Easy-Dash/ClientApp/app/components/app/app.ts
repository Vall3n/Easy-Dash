import { Aurelia, PLATFORM, inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Busy } from '../busy/busy';

@inject(Busy)
export class App {
    router: Router;
<<<<<<< HEAD
    constructor(public busy: Busy) {
=======
    // static inject = [Busy];
    constructor(public busy: Busy) {
        console.warn("App busy", busy)
>>>>>>> develop
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
            route: 'configure',
            name: 'configure',
            settings: { icon: 'fa-cog' },
            moduleId: PLATFORM.moduleName('../configure/configure'),
            nav: true,
            title: 'Configure'
        }]);

        this.router = router;
    }
}
