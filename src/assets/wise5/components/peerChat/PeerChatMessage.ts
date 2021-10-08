export class PeerChatMessage {
  text: string;
  timestamp: number;
  workgroupId: number;

  constructor(workgroupId: number, text: string, timestamp: number) {
    this.text = text;
    this.timestamp = timestamp;
    this.workgroupId = workgroupId;
  }
}
