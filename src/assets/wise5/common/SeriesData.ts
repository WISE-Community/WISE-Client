import { SeriesDataPoint } from './SeriesDataPoint';

export class SeriesData {
  private dataPoints: SeriesDataPoint[];

  constructor(dataPoints?: SeriesDataPoint[]) {
    this.dataPoints = dataPoints ?? [];
  }

  getDataPoints(): SeriesDataPoint[] {
    return this.dataPoints;
  }

  addDataPoint(dataPoint: SeriesDataPoint): void {
    this.dataPoints.push(dataPoint);
  }
}
