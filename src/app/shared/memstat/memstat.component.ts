import {Component, OnInit, OnChanges, Input} from '@angular/core';

@Component({
  selector: 'app-memstat',
  templateUrl: './memstat.component.html',
  styleUrls: ['./memstat.component.css']
})
export class MemstatComponent implements OnInit, OnChanges {

  @Input() private data: Array<any>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

}
