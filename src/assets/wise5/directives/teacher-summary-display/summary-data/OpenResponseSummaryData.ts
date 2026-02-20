import { Annotation } from '../../../common/Annotation';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { IdeasSummaryData } from './IdeasSummaryData';
import { OpenResponseSummaryDataPoint } from './OpenResponseSummaryDataPoint';

export class OpenResponseSummaryData extends IdeasSummaryData {
  constructor(annotations: Annotation[], rubric: CRaterRubric) {
    super(rubric);
    annotations.forEach((annotation) =>
      this.dataPoints.push(new OpenResponseSummaryDataPoint(annotation))
    );
    this.setIdeaDataArray();
  }
}
