import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';

/**
 * Summary data for one choice in one bucket
 */
export class MatchSummaryDataPoint extends SummaryDataPoint {
  private bucketValue: string;
  private position?: number;

  constructor(id: number | string, count?: number, bucketValue?: string, position?: number) {
    super(id, count);
    this.bucketValue = bucketValue;
    this.position = position;
  }

  getBucketValue(): string {
    return this.bucketValue;
  }

  setPosition(position: number): void {
    this.position = position;
  }

  getPosition(): number {
    return this.position;
  }
}
