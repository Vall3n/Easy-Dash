import { PLATFORM, inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Busy } from '../busy/busy';


@inject(Busy)
export class App {
    router: Router;
    themeSelector = false;
    selectedTheme = 'darkly';
    themes = [
        { id: 'cerulean', style: 'dist/bootswatch/cerulean/bootstrap.min.css' },
        { id: 'cosmo', style: 'dist/bootswatch/cosmo/bootstrap.min.css' },
        { id: 'cyborg', style: 'dist/bootswatch/cyborg/bootstrap.min.css' },
        { id: 'darkly', style: 'dist/bootswatch/darkly/bootstrap.min.css' },
        { id: 'flatly', style: 'dist/bootswatch/flatly/bootstrap.min.css' },
        { id: 'journal', style: 'dist/bootswatch/journal/bootstrap.min.css' },
        { id: 'litera', style: 'dist/bootswatch/litera/bootstrap.min.css' },
        { id: 'lumen', style: 'dist/bootswatch/lumen/bootstrap.min.css' },
        { id: 'lux', style: 'dist/bootswatch/lux/bootstrap.min.css' },
        { id: 'materia', style: 'dist/bootswatch/materia/bootstrap.min.css' },
        { id: 'minty', style: 'dist/bootswatch/minty/bootstrap.min.css' },
        { id: 'pulse', style: 'dist/bootswatch/pulse/bootstrap.min.css' },
        { id: 'sandstone', style: 'dist/bootswatch/sandstone/bootstrap.min.css' },
        { id: 'simplex', style: 'dist/bootswatch/simplex/bootstrap.min.css' },
        //{ id: 'sketchy', style: 'dist/bootswatch/sketchy/bootstrap.min.css' },
        { id: 'slate', style: 'dist/bootswatch/slate/bootstrap.min.css' },
        { id: 'solar', style: 'dist/bootswatch/solar/bootstrap.min.css' },
        { id: 'spacelab', style: 'dist/bootswatch/spacelab/bootstrap.min.css' },
        { id: 'superhero', style: 'dist/bootswatch/superhero/bootstrap.min.css' },
        { id: 'united', style: 'dist/bootswatch/united/bootstrap.min.css' },
        { id: 'yeti', style: 'dist/bootswatch/yeti/bootstrap.min.css' }
    ];

    constructor(public busy: Busy) {
        if (this.supportLocalStorage()) {
            const theme = localStorage.getItem('theme');
            if (theme) {
                this.changeTheme(theme);
                this.themeSelector = true;
            } else {
                this.changeTheme(this.selectedTheme);
            }
        }
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'easydash';
        config.map([{
            route: ['', 'dashboard'],
            name: 'dashboard',
            settings: { icon: 'fa-th-large' },
            moduleId: PLATFORM.moduleName('../dashboard/dashboard'),
            nav: true,
            title: 'Dashboard'
        }, {
            route: 'cardview',
            name: 'cardview',
            settings: { icon: 'fa-vcard-o' },
            moduleId: PLATFORM.moduleName('../dashboard-cardview/dashboard-cardview'),
            nav: true,
            title: 'Card View'
        }, {
            route: 'configure',
            name: 'configure',
            settings: { icon: 'fa-cogs' },
            moduleId: PLATFORM.moduleName('../configure/configure'),
            nav: true,
            title: 'Configure'
        }]);

        this.router = router;
    }

    changeTheme(name: string) {
        const file: any = this.themes.find(t => t.id === name);


        const styleSheet: HTMLElement | null = document.getElementById('easy-swatch') as HTMLElement;

        var newlink = document.createElement('link');
        newlink.setAttribute('rel', 'stylesheet');
        newlink.setAttribute('type', 'text/css');
        newlink.setAttribute('href', file.style);
        newlink.setAttribute('id', 'easy-swatch');

        document.getElementsByTagName('head').item(0).replaceChild(newlink, styleSheet);

        if (this.supportLocalStorage()) {
            localStorage.setItem('theme', name);
        }

        this.selectedTheme = name;

    }

    private supportLocalStorage(): boolean {
        try {
            return localStorage !== undefined;
        } catch (e) {
            return false;
        }
    }
}
