export class CRaterIdea {
  name: string;
  detected: boolean;
  characterOffsets: any[];

  constructor(name: string, detected: boolean) {
    this.name = name;
    this.detected = detected;
  }
}
