import { XPlotLine } from './domain/xPlotLine';
import { YPlotLine } from './domain/yPlotLine';
import { PlotLine } from './domain/plotLine';

export class PlotLineManager {
  constructor(
    private xAxisPlotLines: any[] = [],
    private showMouseXPlotLine: boolean = false,
    private showMouseYPlotLine: boolean = false
  ) {}

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

  /**
   * Show the vertical plot line at the given x.
   * @param x Show the vertical line at this x.
   * @param text The text to show on the plot line.
   */
  showXPlotLine(chart: any, x: number, text: string = ''): void {
    this.removeAndAddPlotLine(chart.xAxis[0], new XPlotLine(x, text));
  }

  /**
   * Show the horizontal plot line at the given y.
   * @param y Show the horizontal line at this y.
   * @param text The text to show on the plot line.
   */
  showYPlotLine(chart: any, y: number, text: string = ''): void {
    this.removeAndAddPlotLine(chart.yAxis[0], new YPlotLine(y, text));
  }

  private removeAndAddPlotLine(axis: any, newPlotLine: PlotLine): void {
    axis.removePlotLine(newPlotLine.id);
    axis.addPlotLine(newPlotLine);
  }
}
