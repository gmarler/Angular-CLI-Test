import {Component, OnInit, OnChanges, Input, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {timestamp} from "rxjs/operator/timestamp";

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

  private chart:         any;
  private margin:        any = {top: 5, right: 155, bottom: 120, left: 45};
  private width:         number;
  private height:        number;
  private xScale:        any;
  private xAxisScale:    any;
  private yScale:        any;
  private yAxisScale:    any;
  private yAxisScaleRAM: any;
  private color:         any;
  // Axis entities
  private xAxis:         any;
  private yAxis:         any;
  private yAxisRAM:      any;
  // Axis svg 'g' Group Elements
  private xAxisGroup:    any;
  private yAxisGroup:    any;
  private yAxisGroupRAM: any;
  private legend:        any;
  private area:          any;
  private stack:         any;  // For stacked area graphs
  // Specify the order in which we stack the data in the graph, from the Y axis up
  // NOTE: We're currently excluding: Guest and defump_prealloc
  private keys_in_order: Array<String> =
    [ 'kernel_bytes', 'exec_and_libs_bytes', 'anon_bytes', 'page_cache_bytes',
      'zfs_metadata_bytes', 'zfs_file_data_bytes', 'free_cachelist_bytes',
      'free_freelist_bytes' ];

  constructor(private http: Http) {
    let mydata = this.data;

    this.http.get('sundev51-memstat-20170215.json')
      .subscribe( res => this.data = res.json() );
  }

  ngOnInit() {
    this.createChart();
    // One shot timer for initial test data load
    let timer = Observable.timer(1000);

    timer.subscribe( t => { console.log(this.data); this.updateChart(); } );
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

    let window_inner_height = window.innerHeight;
    let window_outer_height = window.outerHeight;
    console.log('Window Inner Height: ' + window_inner_height);
    console.log('Window Outer Height: ' + window_outer_height);
    let host_picker_height  = d3.select('app-host-picker').property('firstChild').getBoundingClientRect().height;
    let subsystem_height = d3.select('app-subsystem').property('firstChild').getBoundingClientRect().height;
    let metric_height = d3.select('app-metric').property('firstChild').getBoundingClientRect().height;
    console.log(host_picker_height);
    console.log(subsystem_height);
    console.log(metric_height);

    let remaining_height = window_outer_height - host_picker_height -
                           subsystem_height - metric_height -
                           this.margin.top  - this.margin.bottom;

    this.width  = element.offsetWidth  - this.margin.left - this.margin.right;
    this.height = remaining_height
                  - this.margin.top  - this.margin.bottom;
    console.log(element.offsetHeight);
    console.log(element.getBoundingClientRect());
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      // .attr('height', element.offsetHeight);
      .attr('height', remaining_height);

    // chart's plot area
    this.chart = svg.append('g')
      // .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Define the X and Y Scales
    this.xAxisScale = d3.scaleTime().range([0, this.width]);

    this.yAxisScale = d3.scaleLinear().range([this.height, 0]);
    // Set the Y Axis Scale Domain - it's static in this case at 0 to 100 percent,
    // unlike the X Axis Scale, which is constantly increasing.
    this.yAxisScale.domain([0, 1]);
    // Use a Y axis that shows actual RAM size
    this.yAxisScaleRAM = d3.scaleLinear().range([this.height, 0]);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    // Define the color map domain in key order
    this.color.domain(this.keys_in_order);

    // Define the X Axis
    this.xAxis = d3.axisBottom(this.xAxisScale)
      .tickFormat(d3.timeFormat("%Y-%m-%d %X"));

    // Define the left Y Axis (percentage of RAM)
    this.yAxis = d3.axisLeft(this.yAxisScale)
      .ticks(10, '%');

    // Define the right Y Axis (amount of RAM)
    this.yAxisRAM = d3.axisRight(this.yAxisScaleRAM)
         .tickFormat(d3.format('.0s'));

    // Define the X axis g element
    this.xAxisGroup = this.chart.append('g')
      .attr('class', 'x axis axis-x')
      // .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);

    // Create Y Axis g Element
    this.yAxisGroup = this.chart.append('g')
      .attr('class', 'y axis axis-y')
      .call(this.yAxis);

    // Set up the lexical vars, so we don't use this.<funcname> in the following callbacks
    let xAxisScale = this.xAxisScale;
    let yAxisScale = this.yAxisScale;
    this.area = d3.area()
      .x(function(d: any)  { return xAxisScale(d.data.timestamp); } )
      .y0(function(d)      { return yAxisScale(d[0]); })
      .y1(function(d)      { return yAxisScale(d[1]); });

    // This allows stacking the individual area graphs generated by the above
    this.stack = d3.stack();

    // Instead of referencing the keys, reuse the ones stored as part of the color map
    // domain()
    this.stack
       .keys(this.color.domain());

    let top_margin = this.margin.top;
    this.legend = d3.select('svg').selectAll(".legend")
      .data(this.color.domain().slice().reverse())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform',
        function(d,i) {
          // can't use this.margin.top here - using top_margin instead
          let vertical_offset = ((i * 20) + top_margin);
          return `translate(200,${vertical_offset})`;
        }
      );

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
      });
  }

  updateChart() {
    console.log('ENTER updateChart()');
    let currentData     = this.data;
    let keys            = this.keys_in_order;

    // Create Y Axis RAM g Element - if it doesn't exist yet - we do this here instead
    // of on chart creation because we need initial data to know the domain and add
    // the axis to the graph
    if (typeof(this.yAxisGroupRAM) === 'undefined') {
      let totalRAMinBytes = currentData[0].total_bytes;
      console.log('TOTAL RAM IN BYTES: ' + totalRAMinBytes);

      let i: number;
      let RAMscaleValues: Array<number> = [];

      for (i = 0; i < 40; i++) {
        if (Math.pow(2,i) <= totalRAMinBytes) {
          RAMscaleValues.push(Math.pow(2,i));
        }
      }
      RAMscaleValues = [
        0, (128 * Math.pow(2,30)), (256 * Math.pow(2,30)), (512 * Math.pow(2,30)),
        (1024 * Math.pow(2,30))
      ];
      console.log(RAMscaleValues);

      this.yAxisScaleRAM
        .domain([0, totalRAMinBytes]);

      this.yAxisRAM
        .tickValues(RAMscaleValues);

      this.yAxisGroupRAM =
        this.chart.append('g')
          .attr('class', 'yRAM axis axis-yRAM')
          .attr('transform', `translate(${this.width},0)`)
          .call(this.yAxisRAM);
    }

    currentData.forEach(function(d) {
      // convert Epoch seconds timestamp into Epoch millisec timestamp so it can be converted
      // into a Javascript Date object.
      // WARNING: This will be in the local timezone of the browser you load this into!
      d.timestamp = new Date((d.timestamp * 1000));
      // console.log(d);
      keys.forEach(
        function(statname: string) {
          d[statname] /= d['total_bytes'];
        }
      );
    });

    // Recalculate the xAxisScale
    this.xAxisScale
      .domain(d3.extent(currentData, function(d) { return d.timestamp; }));

    // Use these instead of this.<funcname>() below
    let areaFunc = this.area;
    let colorFunc = this.color;

    //
    // GENERAL UPDATE PATTERN
    //
    // JOIN - Join new/updated data
    //
    let memtypeSelection =
      this.chart.selectAll('.memtype')
        .data(this.stack(currentData));

    //
    // UPDATE - Update existing elements as needed
    //
    // Apply the updated xAxisScale to the xAxis
    this.xAxis.scale(this.xAxisScale);

    // Update the xAxis
    this.chart
      .select('.x')
      .transition()
      .duration(1000)
      .call(this.xAxis);

    // Add the latest values to each area's path
    memtypeSelection
      .select('path')
      .transition()
      .duration(1000)
      .attr('d', areaFunc );

    //
    // ENTER - Create new elements as needed
    //
    memtypeSelection
      .enter()
      .append('g')
      .attr('class', 'memtype')
      .append('path')
      .attr('class', 'area')
      .style('fill', function(d) { console.log(colorFunc(d.key)); return colorFunc(d.key); })
      .attr('d', areaFunc );

    //
    // UPDATE + ENTER - Appending to the enter selection expands the update selection
    // to include the entering elements; so operations on the update selection after
    // enter() will apply to both entering and updating nodes
    // binding.style('width', function(d) { return d * 50 + 'px'; })
    //        .text(function(d) { return d; });
    // Update X Axis Text
    this.xAxisGroup
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
        return "rotate(-55)"
      });

    // Y Axis Does not require updating in this case...

    memtypeSelection
      .attr("class", "memtype");

    //
    // EXIT - Remove old nodes as needed
    // binding.exit().style('background-color', 'red').remove();
    //
    memtypeSelection.exit().remove();
  }
}

