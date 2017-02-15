import {Component, OnInit, OnChanges, Input, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import {Http} from "@angular/http";
import {Observable} from "rxjs";

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
  private margin:        any = {top: 20, right: 155, bottom: 140, left: 75};
  private width:         number;
  private height:        number;
  private xScale:        any;
  private xAxisScale:    any;
  private yScale:        any;
  private yAxisScale:    any;
  private color:         any;
  // Axis entities
  private xAxis:         any;
  private yAxis:         any;
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
    let timer = Observable.timer(1000);//

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
    this.xAxisScale = d3.scaleTime().range([0, this.width]);

    this.yAxisScale = d3.scaleLinear().range([this.height, 0]);
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

    // Define the X Axis
    this.xAxis = d3.axisBottom(this.xAxisScale)
      .tickFormat(d3.timeFormat("%Y-%m-%d %X"));

    this.yAxis = d3.axisLeft(this.yAxisScale);

    // Define the X axis g element
    this.xAxisGroup = this.chart.append('g')
      .attr('class', 'x axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(this.xAxis);

    // Create Y Axis g Element
    this.yAxisGroup = this.chart.append('g')
      .attr('class', 'y axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.yAxis);


    this.area = d3.area()
      .x(function(d){ console.log(d);
                        return 1;
                        // return this.xAxisScale(d.data.timestamp);
                        // return this.xAxisScale(d.timestamp);
                      })
      .y0(function(d) { return this.yAxisScale(d[0]); })
      .y1(function(d) { return this.yAxisScale(d[1]); });

    this.stack = d3.stack();
       // .keys(function(d) { return d.values; });

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
      });
  }

  updateChart() {
    let currentData = this.data;

    currentData.forEach(function(d) {
      // convert Epoch seconds timestamp into Epoch millisec timestamp so it can be converted
      // into a Javascript Date object.
      // WARNING: This will be in the local timezone of the browser you load this into!
      d.timestamp = new Date((d.timestamp * 1000));
      // console.log(d);
    });

    // Recalculate the xAxisScale
    this.xAxisScale
      .domain(d3.extent(currentData, function(d) { return d.timestamp; }));


    // Update values for each area to be stacked
    let memtypes = this.stack(this.color.domain().map(function(name) {
      return {
        name: name,
        values: currentData.map(function(d) {
          let obj = {timestamp: d.timestamp, y: d[name] / d.total_bytes };
          return obj;
        })
      };
    }));

    //
    // GENERAL UPDATE PATTERN
    //
    // JOIN - Join new/updated data
    // var binding = svg.selectAll('div').data(data);
    let memtypeSelection =
      this.chart.selectAll(".memtype")
        .data(memtypes);

    //
    // UPDATE - Update existing elements as needed
    //
    // Apply the updated xAxisScale to the xAxis
    this.xAxis.scale(this.xAxisScale);

    // Update the xAxis
    this.chart
      .select(".x")
      .transition()
      .duration(1000)
      .call(this.xAxis);

    // Add the latest values to each area's path
    memtypeSelection
      .select("path")
      .transition()
      .duration(1000)
      .attr("d", function(d) { return this.area(d.values); });

    //
    // ENTER - Create new elements as needed
    //
    memtypeSelection
      .enter()
      .append("g")
      .append("path")
      .attr("class", "area")
      .attr("d", function(d) { return this.area(d.values); })
      .style("fill", function(d) { return this.color(d.name); });

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

