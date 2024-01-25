import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../aiChatMessage';

@Component({
  selector: 'ai-chat-bot-message',
  templateUrl: './ai-chat-bot-message.component.html',
  styleUrls: ['./ai-chat-bot-message.component.scss']
})
export class AiChatBotMessageComponent {
  protected displayNames: string;
  @Input() message: AiChatMessage;
  protected text: string;

  ngOnInit(): void {
    this.displayNames = 'AI Chat Bot';
    this.text = this.message.content;
  }
}
