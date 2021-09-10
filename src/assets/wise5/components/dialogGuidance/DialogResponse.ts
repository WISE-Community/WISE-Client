export class DialogResponse {
  text: string;
  user: string;
  timestamp: number;

  constructor(text: string, timestamp: number) {
    this.text = text;
    this.timestamp = timestamp;
  }
}
