export class DialogResponse {
  text: string;
  user: string;
  timestamp: number;
  workgroupId: number;

  constructor(text: string, timestamp: number, workgroupId: number = null) {
    this.text = text;
    this.timestamp = timestamp;
    this.workgroupId = workgroupId;
  }
}
