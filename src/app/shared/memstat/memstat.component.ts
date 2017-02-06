import {Component, OnInit, OnChanges, Input, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';

// From Example at:
// https://github.com/keathmilligan/angular2-d3-v4

@Component({
  selector: 'app-memstat',
  templateUrl: './memstat.component.html',
  styleUrls: ['./memstat.component.css']
  // encapsulation: ViewEncapsulation.None
})
export class MemstatComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private chart: any;
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private width:  number;
  private height: number;
  private xScale:  any;
  private yScale:  any;
  private colors:  any;
  private xAxis:   any;
  private yAxis:   any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {

  }

  updateChart() {

  }
}

