export class TableSummaryDataPoint {
  private id: string;
  private count: number;

  constructor(id: string) {
    this.id = id;
    this.count = 0;
  }

  getId(): string {
    return this.id;
  }

  incrementCount(incrementBy: number): void {
    this.count += incrementBy;
  }
}
