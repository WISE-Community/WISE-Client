import { ComponentContent } from '../../common/ComponentContent';

export interface GraphContent extends ComponentContent {
  backgroundImage?: string;
  hideTrialSelect: boolean;
  highlightXRangeFromZero: boolean;
  graphTittle: string;
  saveMouseOverPoints: boolean;
  showMouseXPlotLine: boolean;
  showMouseYPlotLine: boolean;
  subtitle: string;
  useCustomLegend: boolean;
  xAxis: any;
  yAxis: any;
}
