export class CRaterIdea {
  name: string;
  detected: boolean;
  characterOffsets: any[];
  description?: string;

  constructor(name: string, detected: boolean) {
    this.name = name;
    this.detected = detected;
  }
}
