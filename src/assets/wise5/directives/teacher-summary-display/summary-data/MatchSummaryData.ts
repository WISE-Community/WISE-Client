import { ComponentState } from '../../../../../app/domain/componentState';
import { MatchSummaryDataPoint } from './MatchSummaryDataPoint';
import { SummaryData } from '../../summary-display/summary-data/SummaryData';

/**
 * Summary data for all choices in all buckets
 */
export class MatchSummaryData extends SummaryData {
  private isOrderedMatch: boolean;
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
          this.extractChoiceDataPerBucket(item.value, bucket.value);
          this.checkIsOrderedMatch(item.isIncorrectPosition);
        });
      });
    });
  }

  private extractChoiceDataPerBucket(itemValue: string, bucketValue: string): void {
    const summaryDataPoint = this.findSummaryDataPoint(itemValue, bucketValue);
    if (summaryDataPoint) {
      summaryDataPoint.incrementCount(1);
    } else {
      this.summaryDataPoints.push(new MatchSummaryDataPoint(itemValue, 1, bucketValue));
    }
  }

  private findSummaryDataPoint(itemValue: string, bucketValue: string): MatchSummaryDataPoint {
    return this.summaryDataPoints.find(
      (dataPoint) => dataPoint.getId() === itemValue && dataPoint.getBucketValue() === bucketValue
    );
  }

  private checkIsOrderedMatch(isIncorrectPosition: boolean): void {
    if (!this.isOrderedMatch) {
      this.isOrderedMatch = [true, false].includes(isIncorrectPosition);
    }
  }

  protected generateNewDataPoint(id: string | number): MatchSummaryDataPoint {
    return new MatchSummaryDataPoint(id);
  }

  getIsOrderedMatch(): boolean {
    return this.isOrderedMatch;
  }
}
