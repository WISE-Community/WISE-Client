import { PlotLine } from './plotLine';

export class YPlotLine extends PlotLine {
  static readonly id: string = 'plot-line-y';

  constructor(y: number, text: string) {
    super(YPlotLine.id, y, text);
    this.label.align = 'right';
  }
}
