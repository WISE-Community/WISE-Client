export class AiChatMessage {
  content: string;
  role: 'assistant' | 'system' | 'user';

  constructor(role: 'assistant' | 'system' | 'user', content: string) {
    this.content = content;
    this.role = role;
  }
}
