export class CRaterIdea {
  name: string;
  detected?: boolean;
  characterOffsets: any[];
  text?: string;
  tags?: string[];

  constructor(name: string, detected?: boolean, text?: string, tags?: string[]) {
    this.name = name;
    if (detected) {
      this.detected = detected;
    }
    if (text) {
      this.text = text;
    }
    if (tags) {
      this.tags = tags;
    }
  }
}
