export class AiChatMessage {
  content: string;
  hidden: boolean;
  name?: string;
  role: 'assistant' | 'system' | 'user';

  constructor(
    role: 'assistant' | 'system' | 'user',
    content: string,
    hidden: boolean = false,
    name?: string
  ) {
    this.content = content;
    this.role = role;
    this.hidden = hidden;
    this.name = name;
  }
}
