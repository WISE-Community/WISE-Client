import { XPlotLine } from './domain/xPlotLine';
import { YPlotLine } from './domain/yPlotLine';

/**
 * Show the vertical plot line at the given x.
 * @param x Show the vertical line at this x.
 * @param text The text to show on the plot line.
 */
export function showXPlotLine(chart: any, x: number, text: string = ''): void {
  const chartXAxis = chart.xAxis[0];
  chartXAxis.removePlotLine(XPlotLine.id);
  chartXAxis.addPlotLine(new XPlotLine(x, text));
}

/**
 * Show the horizontal plot line at the given y.
 * @param y Show the horizontal line at this y.
 * @param text The text to show on the plot line.
 */
export function showYPlotLine(chart: any, y: number, text: string = ''): void {
  const chartYAxis = chart.yAxis[0];
  chartYAxis.removePlotLine(YPlotLine.id);
  chartYAxis.addPlotLine(new YPlotLine(y, text));
}
