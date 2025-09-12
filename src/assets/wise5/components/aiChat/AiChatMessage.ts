export class AiChatMessage {
  content: string;
  hidden: boolean;
  role: 'assistant' | 'system' | 'user';

  constructor(role: 'assistant' | 'system' | 'user', content: string, hidden: boolean = false) {
    this.content = content;
    this.role = role;
    this.hidden = hidden;
  }
}
