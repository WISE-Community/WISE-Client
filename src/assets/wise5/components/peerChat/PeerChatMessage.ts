export class PeerChatMessage {
  componentStateId: number;
  isDeleted: boolean;
  text: string;
  timestamp: number;
  workgroupId: number;

  constructor(
    workgroupId: number,
    text: string,
    timestamp: number,
    componentStateId: number = null,
    isDeleted: boolean = false
  ) {
    this.componentStateId = componentStateId;
    this.isDeleted = isDeleted;
    this.text = text;
    this.timestamp = timestamp;
    this.workgroupId = workgroupId;
  }
}
