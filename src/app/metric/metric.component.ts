import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent implements OnInit {
  private currentMetric: string;
  private metricData = {
    'CPU': {
      metrics: [
        'Utilization'
      ]
    },
    'MEMORY': {
      metrics: [
        'memstat', 'VM Scan Rate', 'freemem'
      ]
    },
    'FILESYSTEM': {
      metrics: []
    },
    'NETWORK': {
      metrics: []
    },
    'KERNEL STACKS': {
      metrics: []
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
