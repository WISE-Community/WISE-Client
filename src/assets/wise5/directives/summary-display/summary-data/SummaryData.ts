import { SummaryDataPoint } from './SummaryDataPoint';

export abstract class SummaryData {
  protected summaryDataPoints: SummaryDataPoint[];

  constructor() {
    this.summaryDataPoints = [];
  }

  protected getDataPointById(id: string | number): SummaryDataPoint {
    return this.summaryDataPoints.find((dataPoint) => dataPoint.getId() === id) ?? null;
  }

  protected incrementSummaryData(id: string | number, incrementBy: number): void {
    const dataPoint = this.getDataPointById(id);
    if (dataPoint) {
      dataPoint.incrementCount(incrementBy);
    } else {
      this.summaryDataPoints.push(this.generateNewDataPoint(id));
    }
  }

  protected abstract generateNewDataPoint(id: string | number): SummaryDataPoint;

  getDataPointCountById(id: string | number): number {
    const dataPoint = this.getDataPointById(id);
    if (dataPoint) {
      return dataPoint.getCount();
    } else {
      return 0;
    }
  }
}
