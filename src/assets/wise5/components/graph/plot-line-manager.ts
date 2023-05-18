import * as Highcharts from 'highcharts';
import { XPlotLine } from './domain/xPlotLine';
import { YPlotLine } from './domain/yPlotLine';

export class PlotLineManager {
  showMouseXPlotLine: boolean;
  showMouseYPlotLine: boolean;
  xAxisPlotLines: any[] = [];
  yAxisPlotLines: any[] = [];

  constructor(
    xAxisPlotLines: any[] = [],
    yAxisPlotLines: any[] = [],
    showMouseXPlotLine: boolean = false,
    showMouseYPlotLine: boolean = false
  ) {
    this.showMouseXPlotLine = showMouseXPlotLine;
    this.showMouseYPlotLine = showMouseYPlotLine;
    this.xAxisPlotLines = xAxisPlotLines;
    this.yAxisPlotLines = yAxisPlotLines;
  }

  getXPlotLines(): any[] {
    return this.xAxisPlotLines;
  }

  setXPlotLine(x: number): void {
    const plotLine = {
      color: 'red',
      width: 2,
      value: x,
      zIndex: 5
    };
    this.xAxisPlotLines = [plotLine];
  }

  isShowMousePlotLine(): boolean {
    return this.isShowMouseXPlotLine() || this.isShowMouseYPlotLine();
  }

  isShowMouseXPlotLine(): boolean {
    return this.showMouseXPlotLine;
  }

  isShowMouseYPlotLine(): boolean {
    return this.showMouseYPlotLine;
  }

  applyHighchartsPlotLinesLabelFix(): void {
    Highcharts.wrap(Highcharts.Axis.prototype, 'getPlotLinePath', function (proceed) {
      var path = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      if (path) {
        path.flat = false;
      }
      return path;
    });
  }

  /**
   * Show the vertical plot line at the given x.
   * @param x Show the vertical line at this x.
   * @param text The text to show on the plot line.
   */
  showXPlotLine(chart: any, x: number, text: string = ''): void {
    const chartXAxis = chart.xAxis[0];
    chartXAxis.removePlotLine(XPlotLine.id);
    chartXAxis.addPlotLine(new XPlotLine(x, text));
  }

  /**
   * Show the horizontal plot line at the given y.
   * @param y Show the horizontal line at this y.
   * @param text The text to show on the plot line.
   */
  showYPlotLine(chart: any, y: number, text: string = ''): void {
    const chartYAxis = chart.yAxis[0];
    chartYAxis.removePlotLine(YPlotLine.id);
    chartYAxis.addPlotLine(new YPlotLine(y, text));
  }
}
