import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../../../assets/wise5/services/utilService';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'milestone-report-graph',
  template:
    '<highcharts-chart [Highcharts]="Highcharts" [options]="chartConfig"></highcharts-chart>'
})
export class MilestoneReportGraphComponent implements OnInit {
  DEFAULT_COLOR = 'rgb(194, 24, 91)';

  @Input() barColor: string;
  categories: any[] = [];
  chartConfig: any;
  @Input() data: any;
  Highcharts: typeof Highcharts = Highcharts;
  @Input() id: string;
  @Input() locations: any[];
  @Input() name: string;
  series: any[];
  @Input() titleColor: string;

  constructor(private utilService: UtilService) {}

  ngOnInit(): void {
    this.data = JSON.parse(this.data.replace(/\'/g, '"'));
    if (this.name == null) {
      this.name = this.id;
    }
    this.calculateGraphDataAndCategories();
    this.setConfig();
  }

  private setConfig(): void {
    this.chartConfig = {
      chart: {
        type: 'column',
        height: 200,
        width: 200,
        style: {
          fontFamily: 'Roboto,Helvetica Neue,sans-serif'
        }
      },
      title: {
        text: this.name,
        style: {
          fontSize: '14px',
          fontWeight: '500',
          color: this.titleColor ? this.titleColor : this.DEFAULT_COLOR
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{y}%'
          }
        },
        column: {
          dataLabels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.series.name}<br/>${$localize`teams`}: ${this.point.count}</b>`;
        }
      },
      xAxis: {
        categories: this.categories
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          enabled: false
        }
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: this.series
    };
  }

  private calculateGraphDataAndCategories(): void {
    const color = this.barColor ? this.barColor : this.DEFAULT_COLOR;
    const step = 100 / this.data.length / 100;
    let opacity = 0;
    const series = [];
    for (const componentData of this.getDataToGraph(this.data, this.locations)) {
      opacity += step;
      const singleSeries = {
        name: this.utilService.trimToLength(componentData.stepTitle, 26),
        color: this.utilService.rgbToHex(color, opacity),
        data: this.getComponentSeriesData(componentData)
      };
      series.push(singleSeries);
    }
    this.series = series;
  }

  private getDataToGraph(data: any, locations: any[]): any {
    return locations == null ? data : this.getDataFromLocations(data, locations);
  }

  private getDataFromLocations(data: any, locations: any[]): any[] {
    return locations.map((location) => {
      data[location - 1];
    });
  }

  private getComponentSeriesData(componentData: any): any {
    const scoreKeysSorted = Object.keys(componentData.counts).sort((a, b) => {
      return parseInt(a) - parseInt(b);
    });
    const seriesData = [];
    for (const scoreKey of scoreKeysSorted) {
      this.categories.push(scoreKey.toString());
      const scoreKeyCount = componentData.counts[scoreKey];
      const scoreKeyPercentage = Math.floor((100 * scoreKeyCount) / componentData.scoreCount);
      const scoreData = {
        y: scoreKeyPercentage,
        count: scoreKeyCount
      };
      seriesData.push(scoreData);
    }
    return seriesData;
  }
}
