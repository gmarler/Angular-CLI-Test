import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule }   from 'angular-in-memory-web-api';
import { HostData }               from "./host-data";
import { AppComponent }           from './app.component';
import { HostService }            from './host.service';
import { HostPickerComponent }    from './host-picker/host-picker.component';


@NgModule({
  declarations: [
    AppComponent,
    HostPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(HostData)
  ],
  providers: [HostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
