import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { DurationPickerModule } from 'ngx-duration-picker';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { AboutComponent } from './components/about/about.component';
import { SweetAlertService } from 'angular-sweetalert-service';


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        DashboardComponent,
        ConfigureComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        DurationPickerModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'configure', component: ConfigureComponent },
            { path: 'about', component: AboutComponent },
            { path: '**', redirectTo: 'dashboard' }
        ])
    ],
    providers: [
        SweetAlertService
    ]
})
export class AppModuleShared {
}
