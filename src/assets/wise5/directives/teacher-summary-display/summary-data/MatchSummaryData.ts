import { ComponentState } from '../../../../../app/domain/componentState';
import { MatchSummaryDataPoint } from './MatchSummaryDataPoint';
import { SummaryData } from '../../summary-display/summary-data/SummaryData';

type BucketData = { bucketValue: string; bucketDataPoints: MatchSummaryDataPoint[] };

/**
 * Summary data for all choices in all buckets
 */
export class MatchSummaryData extends SummaryData {
  private isOrderedMatch: boolean;
  protected bucketsData: BucketData[] = [];

  constructor(componentStates: ComponentState[]) {
    super();
    this.extractBucketData(componentStates);
  }

  getBucketsData(): BucketData[] {
    return this.bucketsData;
  }

  private extractBucketData(componentStates: ComponentState[]): void {
    componentStates.forEach((componentState) => {
      componentState.studentData.buckets.forEach((bucketStudentData) => {
        const newBucketData = { bucketValue: bucketStudentData.value, bucketDataPoints: [] };
        bucketStudentData.items.forEach((item) => {
          this.extractChoiceDataPerBucket(item.value, bucketStudentData.value, newBucketData);
          this.checkIsOrderedMatch(item.isIncorrectPosition);
        });
        this.addNewBucketDataToSummaryData(newBucketData);
      });
    });
  }

  private extractChoiceDataPerBucket(
    itemValue: string,
    bucketValue: string,
    bucketData: BucketData
  ): void {
    const summaryDataPoint = this.findSummaryDataPoint(itemValue, bucketValue);
    if (summaryDataPoint) {
      summaryDataPoint.incrementCount(1);
    } else {
      const newDataPoint = new MatchSummaryDataPoint(itemValue, 1, bucketValue);
      this.summaryDataPoints.push(newDataPoint);
      bucketData.bucketDataPoints.push(newDataPoint);
    }
  }

  private addNewBucketDataToSummaryData(newBucketData: BucketData): void {
    const bucketMatch = this.findBucketByValue(newBucketData.bucketValue);
    if (bucketMatch) {
      bucketMatch.bucketDataPoints = bucketMatch.bucketDataPoints.concat(
        newBucketData.bucketDataPoints
      );
    } else {
      this.bucketsData.push(newBucketData);
    }
  }

  private findBucketByValue(bucketValue: string): BucketData {
    return this.bucketsData.find((bucketData) => bucketData.bucketValue === bucketValue);
  }

  private findSummaryDataPoint(itemValue: string, bucketValue: string): MatchSummaryDataPoint {
    return this.bucketsData
      .find((bucket) => bucket.bucketValue === bucketValue)
      ?.bucketDataPoints.find((dataPoint) => dataPoint.getId() === itemValue);
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
