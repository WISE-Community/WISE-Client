import { Annotation } from '../../../common/Annotation';
import { IdeasSummaryDataPoint } from './IdeasSummaryDataPoint';

export class OpenResponseSummaryDataPoint extends IdeasSummaryDataPoint {
  constructor(annotation: Annotation) {
    super();
    annotation.data.ideas?.forEach((idea) => this.processIdea(idea));
  }
}
