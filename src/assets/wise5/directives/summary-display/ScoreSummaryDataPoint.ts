export class ScoreSummaryDataPoint {
  private score: number;
  private count: number;

  constructor(score: number) {
    this.score = score;
    this.count = 0;
  }

  getScore(): number {
    return this.score;
  }

  incrementCount(): void {
    this.count++;
  }
}
