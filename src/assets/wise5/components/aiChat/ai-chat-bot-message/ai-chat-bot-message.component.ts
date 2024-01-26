import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';

@Component({
  selector: 'ai-chat-bot-message',
  templateUrl: './ai-chat-bot-message.component.html',
  styleUrls: ['./ai-chat-bot-message.component.scss']
})
export class AiChatBotMessageComponent {
  @Input() message: AiChatMessage;
}
