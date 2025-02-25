import { Annotation } from '../../common/Annotation';
import { ScoreSummaryDataPoint } from './ScoreSummaryDataPoint';

export class ScoreSummaryData {
  private summaryDataPoints: ScoreSummaryDataPoint[];

  constructor(annotations: Annotation[], maxScore: number) {
    for (let scoreValue = 0; scoreValue <= maxScore; scoreValue++) {
      this.summaryDataPoints.push(new ScoreSummaryDataPoint(scoreValue));
    }
    annotations.forEach((annotation) => this.addAnnotationDataToSummaryData(annotation));
  }

  private addAnnotationDataToSummaryData(annotation: Annotation): void {
    const score = annotation.data.value;
    this.incrementSummaryData(score);
  }

  incrementSummaryData(score: number) {
    this.summaryDataPoints.forEach((dataPoint) => {
      if (dataPoint.getScore() === score) {
        dataPoint.incrementCount();
      }
    });
  }

  //   getSummaryDataCount(score: number): number {

  //   }
}
