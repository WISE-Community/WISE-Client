export class MultipleChoiceSummaryDataPoint {
  private id: number | string;
  private text: string;
  private isCorrect: boolean;
  private count: number;

  constructor(id: number | string, text: string, isCorrect: boolean) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
    this.count = 0;
  }

  getId(): number | string {
    return this.id;
  }

  incrementCount(): void {
    this.count++;
  }
}
