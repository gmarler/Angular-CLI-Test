import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent implements OnInit {
  private currentMetric: string;
  private metricData =   [
    { id: 1, name: 'CPU',
      metrics: [
        'Utilization'
      ]
    },
    { id: 2, name: 'MEMORY',
      metrics: [
        'memstat', 'VM Scan Rate', 'freemem'
      ]
    },
    { id: 3, name: 'FILESYSTEM',
      metrics: []
    },
    { id: 4, name: 'NETWORK',
      metrics: []
    },
    { id: 5, name: 'KERNEL STACKS',
      metrics: []
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
