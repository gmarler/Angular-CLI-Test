import { Component, OnInit } from '@angular/core';
import {HostService} from '../host.service';
import {Host} from "../host";
import {CompleterService, CompleterData, CompleterItem} from "ng2-completer";

@Component({
  selector: 'app-host-picker',
  templateUrl: './host-picker.component.html',
  styleUrls: ['./host-picker.component.css']
})
export class HostPickerComponent implements OnInit {
  // private hosts_observer = this.hostService.loadHosts();
  private currentHostTimeZone: string;
  errorMessage: string;
  hosts:        Host[];
  private HostSearchStr: string;
  private PASearchStr:   string;
  private dataService:   CompleterData;
  private PAService:     CompleterData;
  private searchData =   [
    { id: 1, name: 'fwsse37',  time_zone: 'US/Central' },
    { id: 2, name: 'fwsse38',  time_zone: 'US/Central' },
    { id: 3, name: 'control',  time_zone: 'US/Eastern' },
    { id: 4, name: 'kaos',     time_zone: 'US/Eastern' },
    { id: 5, name: 'sundev51', time_zone: 'US/Eastern' },
    { id: 6, name: 'pine',     time_zone: 'US/Pacific' }
  ];
  private PAServers = [
    { id: 1, name: 'nydevsol10.dev.bloomberg.com' }
  ];

  constructor(private hostService: HostService,
              private completerService: CompleterService) {
    this.dataService = completerService.local(this.searchData, 'name', 'name');
    this.PAService   = completerService.local(this.PAServers,  'name', 'name');
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

  onHostSelect(selected: CompleterItem) {
    console.log(selected);
    if (selected) {
      this.currentHostTimeZone = selected.originalObject.time_zone;
    } else {
      console.log("SELECTION WEIRD!");
    }
    // this.hostService.setCurrentHost(event.target.text);
    // this.currentHostTimeZone = event.target.time_zone;
    // console.log(event.target.text);
  }
}
