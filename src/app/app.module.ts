import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { FormsModule }             from '@angular/forms';
import { HttpModule }              from '@angular/http';
import { RouterModule, Routes }    from '@angular/router';
import { LocationStrategy,
         HashLocationStrategy }    from '@angular/common';

import { InMemoryWebApiModule }    from 'angular-in-memory-web-api';
import { HostData }                from "./host-data";
import { AppComponent }            from './app.component';
import { HostService }             from './host.service';
import { HostPickerComponent }     from './host-picker/host-picker.component';
import {Ng2CompleterModule}        from 'ng2-completer';
import { SubsystemComponent }      from './subsystem/subsystem.component';
import { MetricComponent }         from './metric/metric.component';
import { MemstatComponent }        from './shared/memstat/memstat.component';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { HomeComponent }           from './home/home.component';
import { AboutComponent }          from './about/about.component';

const routes: Routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      component: HomeComponent },
  { path: 'about',     component: AboutComponent }  // ,
  // { path: 'host',      component: HostPickerComponent },
  // { path: 'subsystem', component: SubsystemComponent },
  // { path: 'metric',    component: MetricComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HostPickerComponent,
    SubsystemComponent,
    MetricComponent,
    MemstatComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    Ng2CompleterModule,
    FormsModule,
    HttpModule,
    Ng2DatetimePickerModule,
    RouterModule.forRoot(routes)
    // InMemoryWebApiModule.forRoot(HostData)
  ],
  providers: [
    HostService,
    { provide: LocationStrategy, useClass: HashLocationStrategy } // ,
    // { provide: APP_BASE_HREF,    useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
