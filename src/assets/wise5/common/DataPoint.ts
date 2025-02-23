export class DataPoint {
  name: string | number;
  y: any;
  color: string;

  constructor(name: string | number, y: any, color?: string) {
    this.name = name;
    this.y = y;
    if (color) {
      this.color = color;
    }
  }
}
