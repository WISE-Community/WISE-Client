import { DataPoint } from './DataPoint';

export class SeriesData {
  private dataPoints: DataPoint[];

  constructor(dataPoints?: DataPoint[]) {
    this.dataPoints = dataPoints ?? [];
  }

  getDataPoints() {
    return this.dataPoints;
  }

  addDataPoint(dataPoint: DataPoint) {
    this.dataPoints.push(dataPoint);
  }
}
