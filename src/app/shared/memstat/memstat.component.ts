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

  private chart:      any;
  private margin:     any = {top: 20, right: 155, bottom: 140, left: 75};
  private width:      number;
  private height:     number;
  private xScale:     any;
  private xAxisScale: any;
  private yScale:     any;
  private yAxisScale: any;
  private colors:     any;
  private xAxis:      any;
  private yAxis:      any;
  // Specify the order in which we stack the data in the graph, from the Y axis up
  // NOTE: We're currently excluding: Guest and defump_prealloc
  private keys_in_order: Array<String> =
    [ 'kernel_bytes', 'exec_and_libs_bytes', 'anon_bytes', 'page_cache_bytes',
      'zfs_metadata_bytes', 'zfs_file_data_bytes', 'free_cachelist_bytes',
      'free_freelist_bytes' ];

  constructor() { }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width  = element.offsetWidth  - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top  - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart's plot area
    this.chart = svg.append('g')
      // .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Define the X and Y Scales
    this.xAxisScale = d3.scaleTime().range([0,this.width]);


  }

  updateChart() {

  }
}

