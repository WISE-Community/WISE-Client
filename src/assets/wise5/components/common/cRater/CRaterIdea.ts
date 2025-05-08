export class CRaterIdea {
  name: string;
  detected?: boolean;
  characterOffsets: any[];
  text?: string;

  constructor(name: string, detected?: boolean, text?: string) {
    this.name = name;
    if (detected) {
      this.detected = detected;
    }
    if (text) {
      this.text = text;
    }
  }
}
