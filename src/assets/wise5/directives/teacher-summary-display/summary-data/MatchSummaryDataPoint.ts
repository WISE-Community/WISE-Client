import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';

/**
 * Summary data for one choice in one bucket
 */
export class MatchSummaryDataPoint extends SummaryDataPoint {
  private bucketValue: string;

  constructor(id: number | string, count?: number, bucketValue?: string) {
    super(id, count);
    this.bucketValue = bucketValue;
  }

  getBucketValue(): string {
    return this.bucketValue;
  }
}
