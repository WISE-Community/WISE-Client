export class SeriesDataPoint {
  name: string | number;
  y: number;
  color: string;

  constructor(name: string | number, y: number, color?: string) {
    this.name = name;
    this.y = y;
    if (color) {
      this.color = color;
    }
  }
}
