import { Component, OnInit } from '@angular/core';
import {HostService} from '../host.service';
import {Host} from "../host";
import {CompleterService, CompleterData} from "ng2-completer";

@Component({
  selector: 'app-host-picker',
  templateUrl: './host-picker.component.html',
  styleUrls: ['./host-picker.component.css']
})
export class HostPickerComponent implements OnInit {
  // private hosts_observer = this.hostService.loadHosts();
  errorMessage: string;
  hosts:        Host[];
  private searchStr:    string;
  private dataService:  CompleterData;
  private searchData = [
    { id: 1, name: 'fwsse37',  time_zone: 'US/Central' },
    { id: 2, name: 'fwsse38',  time_zone: 'US/Central' },
    { id: 3, name: 'control',  time_zone: 'US/Eastern' },
    { id: 4, name: 'kaos',     time_zone: 'US/Eastern' },
    { id: 5, name: 'sundev51', time_zone: 'US/Eastern' },
    { id: 6, name: 'pine',     time_zone: 'US/Pacific' }
  ];

  constructor(private hostService: HostService,
              private completerService: CompleterService) {
    this.dataService = completerService.local(this.searchData, 'name', 'name');
  }

  ngOnInit() {
    this.getHosts();
  }

  getHosts() {
    this.hostService.getHosts()
      .subscribe(
        hosts => this.hosts = hosts,
        error => this.errorMessage = <any>error
      );
  }

  onChange(event) {
    // For Debug
    // console.log(event);
    // For Bootstrap 4 dropdown button menu
    console.log(event.target.text);
    // For select/option
    // console.log(event.target.value);
  }

  onHostSelect(event) {
    // use host selected from dropdown menu
    this.hostService.setCurrentHost(event.target.text);
    console.log(event.target.text);
  }
}
