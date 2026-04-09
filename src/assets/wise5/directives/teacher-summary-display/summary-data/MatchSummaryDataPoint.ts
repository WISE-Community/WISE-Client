import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';

/**
 * Summary data for one choice in one bucket
 */
export class MatchSummaryDataPoint extends SummaryDataPoint {
  private choiceValue: string;

  constructor(id: number | string, count?: number, choiceValue?: string) {
    super(id, count);
    this.choiceValue = choiceValue;
  }

  getChoiceValue(): string {
    return this.choiceValue;
  }

  getBucketValue(): string {
    return this.getId() as string;
  }
}
