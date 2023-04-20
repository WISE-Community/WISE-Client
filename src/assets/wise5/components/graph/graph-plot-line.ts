import { XPlotLine } from './domain/xPlotLine';

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
