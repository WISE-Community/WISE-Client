import { SummaryDataPoint } from './SummaryDataPoint';

export abstract class SummaryData {
  protected summaryDataPoints: SummaryDataPoint[];

  constructor(dataPoints?: SummaryDataPoint[]) {
    this.summaryDataPoints = [];
    if (dataPoints) {
      dataPoints.forEach((dataPoint) => this.summaryDataPoints.push(dataPoint));
    }
  }

  protected getDataPointById(id: string | number): SummaryDataPoint {
    return this.summaryDataPoints.find((dataPoint) => dataPoint.getId() === id) ?? null;
  }

  getDataPoints(): SummaryDataPoint[] {
    return this.summaryDataPoints;
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
    return this.getDataPointById(id)?.getCount() ?? 0;
  }
}
