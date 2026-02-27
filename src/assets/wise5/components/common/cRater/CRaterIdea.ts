export class CRaterIdea {
  name: string;
  detected?: boolean;
  color?: string;
  characterOffsets: any[];
  text?: string;
  tags?: string[];

  constructor(name: string, detected?: boolean, text?: string, tags?: string[], color?: string) {
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
    if (color) {
      this.color = color;
    }
  }
}
