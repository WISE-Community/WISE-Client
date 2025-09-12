import { ComponentState } from '../../../../../app/domain/componentState';
import { DialogGuidanceSummaryDataPoint } from './DialogGuidanceSummaryDataPoint';
import { IdeasSummaryData } from './IdeasSummaryData';

export class DialogGuidanceSummaryData extends IdeasSummaryData {
  constructor(componentStates: ComponentState[]) {
    super();
    componentStates.forEach((componentState) =>
      this.dataPoints.push(new DialogGuidanceSummaryDataPoint(componentState))
    );
  }
}
