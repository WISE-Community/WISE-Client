import { ComponentState } from '../../../../../app/domain/componentState';
import { MatchSummaryDataPoint } from './MatchSummaryDataPoint';
import { SummaryData } from '../../summary-display/summary-data/SummaryData';

export type ChoiceData = { choiceValue: string; choiceDataPoints: MatchSummaryDataPoint[] };
export type BucketData = { bucketValue: string; bucketDataPoints: MatchSummaryDataPoint[] };

/**
 * Summary data for all choices, each with a breakdown per bucket
 */
export class MatchSummaryData extends SummaryData {
  protected choicesData: ChoiceData[] = [];

  constructor(componentStates: ComponentState[]) {
    super();
    this.extractChoiceData(componentStates);
  }

  getChoicesData(): ChoiceData[] {
    return this.choicesData;
  }

  getBucketsData(): BucketData[] {
    const bucketsMap = new Map<string, BucketData>();
    this.choicesData.forEach((choice) => {
      choice.choiceDataPoints.forEach((point) => {
        const bucketValue = point.getBucketValue();
        if (!bucketsMap.has(bucketValue)) {
          bucketsMap.set(bucketValue, { bucketValue, bucketDataPoints: [] });
        }
        bucketsMap.get(bucketValue).bucketDataPoints.push(point);
      });
    });
    return Array.from(bucketsMap.values()).sort(
      (a, b) => this.getTotalCount(b) - this.getTotalCount(a)
    );
  }

  private getTotalCount(bucket: BucketData): number {
    return bucket.bucketDataPoints.reduce((sum, point) => sum + point.getCount(), 0);
  }

  private extractChoiceData(componentStates: ComponentState[]): void {
    componentStates.forEach((componentState) => {
      componentState.studentData.buckets.forEach((bucketStudentData, index) => {
        if (index === 0) {
          bucketStudentData.items.forEach((choice) => this.registerChoice(choice.value));
        } else {
          bucketStudentData.items.forEach((choice) => {
            this.extractBucketDataPerChoice(choice.value, bucketStudentData.value);
          });
        }
      });
    });
  }

  private registerChoice(choiceValue: string): void {
    if (!this.findChoiceByValue(choiceValue)) {
      this.choicesData.push({ choiceValue, choiceDataPoints: [] });
    }
  }

  private extractBucketDataPerChoice(choiceValue: string, bucketValue: string): void {
    const dataPoint = this.findSummaryDataPoint(choiceValue, bucketValue);
    if (dataPoint) {
      dataPoint.incrementCount(1);
    } else {
      const newDataPoint = new MatchSummaryDataPoint(bucketValue, 1, choiceValue);
      this.summaryDataPoints.push(newDataPoint);
      this.addDataPointToChoiceData(choiceValue, newDataPoint);
    }
  }

  private addDataPointToChoiceData(choiceValue: string, dataPoint: MatchSummaryDataPoint): void {
    const choiceMatch = this.findChoiceByValue(choiceValue);
    if (choiceMatch) {
      choiceMatch.choiceDataPoints.push(dataPoint);
    } else {
      this.choicesData.push({ choiceValue, choiceDataPoints: [dataPoint] });
    }
  }

  private findChoiceByValue(choiceValue: string): ChoiceData {
    return this.choicesData.find((c) => c.choiceValue === choiceValue);
  }

  private findSummaryDataPoint(choiceValue: string, bucketValue: string): MatchSummaryDataPoint {
    return this.choicesData
      .find((c) => c.choiceValue === choiceValue)
      ?.choiceDataPoints.find((dp) => dp.getBucketValue() === bucketValue);
  }

  protected generateNewDataPoint(id: string | number): MatchSummaryDataPoint {
    return new MatchSummaryDataPoint(id);
  }
}
