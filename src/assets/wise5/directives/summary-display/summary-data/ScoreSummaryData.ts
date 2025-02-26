import { Annotation } from '../../../common/Annotation';
import { ScoreSummaryDataPoint } from './ScoreSummaryDataPoint';
import { SummaryData } from './SummaryData';

export class ScoreSummaryData extends SummaryData {
  protected summaryDataPoints: ScoreSummaryDataPoint[];

  constructor(annotations: Annotation[], maxScore: number) {
    super();
    for (let scoreValue = 0; scoreValue <= maxScore; scoreValue++) {
      this.summaryDataPoints.push(new ScoreSummaryDataPoint(scoreValue));
    }
    annotations.forEach((annotation) => this.addAnnotationDataToSummaryData(annotation));
  }

  private addAnnotationDataToSummaryData(annotation: Annotation): void {
    const score = annotation.data.value;
    this.incrementSummaryData(score, 1);
  }

  protected generateNewDataPoint(id: string | number): ScoreSummaryDataPoint {
    return new ScoreSummaryDataPoint(id);
  }

  //   getSummaryDataCount(score: number): number {

  //   }
}
