import { ComponentState } from '../../../../../app/domain/componentState';
import { IdeasSummaryDataPoint } from './IdeasSummaryDataPoint';

export class DialogGuidanceSummaryDataPoint extends IdeasSummaryDataPoint {
  constructor(componentState: ComponentState) {
    super();
    componentState.studentData.responses.forEach((response) => {
      response.ideas?.forEach((idea) => this.processIdea(idea));
    });
  }
}
