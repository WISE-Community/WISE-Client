export abstract class SummaryDataPoint {
  protected id: number | string;
  protected count: number;

  constructor(id: number | string, count?: number) {
    this.id = id;
    this.count = count ?? 0;
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
