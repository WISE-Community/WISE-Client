import { ComponentState } from '../../../../../app/domain/componentState';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { DialogGuidanceSummaryDataPoint } from './DialogGuidanceSummaryDataPoint';
import { IdeasSummaryData } from './IdeasSummaryData';

export class DialogGuidanceSummaryData extends IdeasSummaryData {
  constructor(componentStates: ComponentState[], rubric: CRaterRubric) {
    super(rubric);
    componentStates.forEach((componentState) =>
      this.dataPoints.push(new DialogGuidanceSummaryDataPoint(componentState))
    );
  }
}
