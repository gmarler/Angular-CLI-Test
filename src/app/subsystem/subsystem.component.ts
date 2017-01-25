import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subsystem',
  templateUrl: './subsystem.component.html',
  styleUrls: ['./subsystem.component.css']
})
export class SubsystemComponent implements OnInit {
  private currentSubsystem: string;
  private subsystemData =   [
    { id: 1, name: 'CPU'},
    { id: 2, name: 'MEMORY' },
    { id: 3, name: 'FILESYSTEM' },
    { id: 4, name: 'NETWORK'   },
    { id: 5, name: 'KERNEL STACKS' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
