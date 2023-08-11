import { PlotLine } from './plotLine';

export class XPlotLine extends PlotLine {
  static readonly id: string = 'plot-line-x';

  constructor(x: number, text: string) {
    super(XPlotLine.id, x, text);
    this.label.verticalAlign = 'top';
  }
}
