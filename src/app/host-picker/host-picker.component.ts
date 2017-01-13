import { Component, OnInit } from '@angular/core';
import {HostService} from '../host.service';

@Component({
  selector: 'app-host-picker',
  templateUrl: './host-picker.component.html',
  styleUrls: ['./host-picker.component.css']
})
export class HostPickerComponent implements OnInit {
  private hosts_observer;

  constructor(private hostService: HostService) {
    this.hosts_observer = this.hostService.getHosts();
  }

  ngOnInit() {
  }

}
