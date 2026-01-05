export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
  deleted: boolean;
}

export class ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  nodeId: string;
  timestamp: Date = new Date();

  constructor(role: 'user' | 'assistant' | 'system', content: string, nodeId: string) {
    this.role = role;
    this.content = content;
    this.nodeId = nodeId;
  }
}
