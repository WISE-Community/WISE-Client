import { Annotation } from '../../../common/Annotation';
import { IdeasSummaryData } from './IdeasSummaryData';
import { OpenResponseSummaryDataPoint } from './OpenResponseSummaryDataPoint';

export class OpenResponseSummaryData extends IdeasSummaryData {
  constructor(annotations: Annotation[]) {
    super();
    annotations.forEach((annotation) =>
      this.dataPoints.push(new OpenResponseSummaryDataPoint(annotation))
    );
  }
}
