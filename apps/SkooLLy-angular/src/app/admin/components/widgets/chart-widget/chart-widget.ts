import { ChartConfiguration, ChartType, ChartTypeRegistry, ChartData, ChartOptions } from 'chart.js';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import { 
//   NgApexchartsModule,
//   ApexChart,
//   ApexAxisChartSeries,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexTitleSubtitle,
//   ApexStroke,
//   ApexTooltip,
//   ApexLegend,
//   ApexFill,
//   ApexPlotOptions
//  } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis?: ApexXAxis;
//   labels?: string[];
//   dataLabels?: ApexDataLabels;
//   stroke?: ApexStroke;
//   title?: ApexTitleSubtitle;
//   tooltip?: ApexTooltip;
//   legend?: ApexLegend;
//   fill?: ApexFill;
//   plotOptions?: ApexPlotOptions;
// };

@Component({
  selector: 'app-chart-widget',
  imports: [
    // NgApexchartsModule,
    NgChartsModule,
    MatCardModule
  ],
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.scss'
})
export class ChartWidget implements OnInit {
  @Input() title: string = '';
  @Input() chartType!: keyof ChartTypeRegistry;
  @Input() chartLabels: string[] = [];
  @Input() chartData: number[] = [];
  @Input() chartOptions!: ChartOptions;
  @Input() chartLegend?: boolean = true;

  defaultColors = [
    '#4f46e5', '#22c55e', '#ec4899', '#f59e0b', '#0ea5e9', '#8b5cf6'
  ];

  constructor() {}

  ngOnInit(): void {
      
  }

  // public chartOptions: Partial<ChartOptions> = {
  //   series: [
  //     {
  //       name: 'Tasks',
  //       data: [10, 20, 15, 30]
  //     }
  //   ],
  //   chart: {
  //     type: 'line',
  //     height: 350
  //   },
  //   xaxis: {
  //     categories: ['Mon', 'Tue', 'Wed', 'Thu']
  //   }
  // };

  // ngOnInit(): void {
  //     this.setupChart();
  // }

  // setupChart() {
  //   if(this.chartType === 'line') {
  //     this.chartOptions = {
  //       series: this.data.series,
  //       chart: {
  //         type: 'line',
  //         height: 300
  //       },
  //       xaxis: {
  //         categories: this.data.categories
  //       },
  //       stroke: {
  //         curve: 'smooth'
  //       },
  //       title: {
  //         text: this.title
  //       }
  //     };
  //   }

  //   if(this.chartType === 'donut') {
  //     this.chartOptions = {
  //       series: this.data.series,
  //       chart: {
  //         type: 'donut',
  //         height: 300
  //       },
  //       labels: this.data.labels,
  //       title: {
  //         text: this.title
  //       },
  //       legend: {
  //         position: 'bottom'
  //       }
  //     };
  //   }

  //   if(this.chartType === 'bar') {
  //     this.chartOptions = {
  //       series: this.data.series,
  //       chart: {
  //         type: 'bar',
  //         height: 300
  //       },
  //       xaxis: {
  //         categories: this.data.categories
  //       },
  //       plotOptions: {
  //         bar: {
  //           borderRadius: 6,
  //           horizontal: false,
  //           columnWidth: '50%',
  //         }
  //       },
  //       dataLabels: {
  //         enabled: false
  //       },
  //       title: {
  //         text: this.title
  //       },
  //       fill: {
  //         colors: ['#00bcd4']
  //       }
  //     }
  //   }
  // }
}
