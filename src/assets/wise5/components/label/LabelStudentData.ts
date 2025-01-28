export class LabelStudentData {
  backgroundImage: string = null;
  labels: any[] = [];
  submitCounter: number = 0;
  version: number = 2;

  constructor(
    labels: any[] = [],
    backgroundImage: string = null,
    submitCounter: number = 0,
    version: number = 2
  ) {
    this.labels = labels;
    this.backgroundImage = backgroundImage;
    this.submitCounter = submitCounter;
    this.version = version;
  }
}
