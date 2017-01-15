import { Component, OnInit } from '@angular/core';
import {HostService} from '../host.service';
import {Host} from "../host";

@Component({
  selector: 'app-host-picker',
  templateUrl: './host-picker.component.html',
  styleUrls: ['./host-picker.component.css']
})
export class HostPickerComponent implements OnInit {
  // private hosts_observer = this.hostService.loadHosts();
  errorMessage: string;
  hosts:        Host[];

  constructor(private hostService: HostService) {
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
}
