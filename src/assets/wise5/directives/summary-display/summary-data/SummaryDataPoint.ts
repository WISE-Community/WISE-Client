export abstract class SummaryDataPoint {
  protected id: number | string;
  protected count: number;

  constructor(id: number | string) {
    this.id = id;
    this.count = 0;
  }

  getId(): number | string {
    return this.id;
  }

  getCount(): number {
    return this.count;
  }

  incrementCount(incrementBy: number): void {
    this.count += incrementBy;
  }
}
