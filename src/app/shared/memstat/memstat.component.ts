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
  private color:      any;
  private xAxis:      any;
  private yAxis:      any;
  private legend:     any;
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

    // let document_height = d3.select(document).height();
    // let used_height     = d3.select('body').height();
    // let remaining_height = document_height - used_height;

    this.width  = element.offsetWidth  - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top  - this.margin.bottom;
    console.log(element.offsetHeight);
    console.log(element.getBoundingClientRect());
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart's plot area
    this.chart = svg.append('g')
      // .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Define the X and Y Scales
    this.xAxisScale = d3.scaleTime().range([0,this.width]);

    this.yAxisScale = d3.scaleLinear().range([this.height,0]);
    // Set the Y Axis Scale Domain - it's static in this case at 0 to 100 percent,
    // unlike the X Axis Scale, which is constantly increasing.
    this.yAxisScale.domain([0, 1]);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    // Define the color map domain in key order
    this.color.domain(
      this.keys_in_order
        .filter(
          function(key) {
            return (key !== 'timestamp' && key !== 'total_bytes' && key !== 'guest');
          }
        )
    );

    // Define the X and Y axes
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xAxisScale));

    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yAxisScale));

    this.legend = d3.select('svg').selectAll(".legend")
      .data(this.color.domain().slice().reverse())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d,i) { return `translate(35,` + i * 25 + `)`; });

    this.legend.append('rect')
      // .attr('x', this.width + this.margin.left + this.margin.right - 18)
      .attr('x', this.width - 18)
      .attr('width',  18)
      .attr('height', 18)
      .style('fill', this.color);

    this.legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function(d) {
        const regex1 = /_bytes$/;
        const regex2 = /^(.)/;
        const regex3 = /_/g;
        const regex4 = /zfs/gi;
        let cvt_name = d;
        cvt_name = cvt_name.replace(regex1, "");
        cvt_name = cvt_name.replace(regex2,function (s) { return s.toUpperCase(); });
        cvt_name = cvt_name.replace(regex3, " ");
        // cvt_name = cvt_name.replace(/\_(.)/g, function (s = $1) { return s.toUpperCase() });
        cvt_name = cvt_name.replace(regex4,function (s) { return s.toUpperCase(); });
        return cvt_name;
      })
  }

  updateChart() {

  }
}

