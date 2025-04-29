import { ComponentState } from '../../../../../app/domain/componentState';
import { SummaryData } from '../../summary-display/summary-data/SummaryData';
import { MatchSummaryDataPoint } from './MatchSummaryDataPoint';

/**
 * Summary data for all choices in all buckets
 */
export class MatchSummaryData extends SummaryData {
  protected summaryDataPoints: MatchSummaryDataPoint[] = [];

  constructor(componentStates: ComponentState[]) {
    super();
    this.extractBucketData(componentStates);
  }

  private extractBucketData(componentStates: ComponentState[]): void {
    componentStates.forEach((componentState) => {
      componentState.studentData.buckets.forEach((bucket) => {
        bucket.items.forEach((item) => {
          console.log(item);
          const summaryDataPoint = this.summaryDataPoints.find(
            (dataPoint) =>
              dataPoint.getId() === item.id && dataPoint.getBucketValue() === bucket.value
          );
          if (summaryDataPoint) {
            summaryDataPoint.incrementCount(1);
          } else {
            this.summaryDataPoints.push(new MatchSummaryDataPoint(item.id, 1, bucket.value));
          }
        });
      });
    });
  }

  protected generateNewDataPoint(id: string | number): MatchSummaryDataPoint {
    return new MatchSummaryDataPoint(id);
  }
}
