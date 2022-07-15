export class Branch {
  startPoint: string;
  paths: string[][];
  endPoint: string;

  constructor(startPoint: string, paths: string[][], endPoint: string) {
    this.startPoint = startPoint;
    this.paths = paths;
    this.endPoint = endPoint;
  }
}
