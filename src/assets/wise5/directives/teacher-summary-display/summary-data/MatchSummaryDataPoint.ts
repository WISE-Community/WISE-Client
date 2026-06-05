import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';

/**
 * Summary data for one choice in one bucket
 */
export class MatchSummaryDataPoint extends SummaryDataPoint {
  private choiceValue: string;
  private workgroupIds: number[] = [];

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

  addWorkgroupId(workgroupId: number): void {
    if (!this.workgroupIds.includes(workgroupId)) {
      this.workgroupIds.push(workgroupId);
    }
  }

  getWorkgroupIds(): number[] {
    return this.workgroupIds;
  }
}
