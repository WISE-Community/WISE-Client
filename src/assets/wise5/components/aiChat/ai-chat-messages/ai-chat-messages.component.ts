import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../aiChatMessage';

@Component({
  selector: 'ai-chat-messages',
  templateUrl: './ai-chat-messages.component.html',
  styleUrls: ['./ai-chat-messages.component.scss']
})
export class AiChatMessagesComponent {
  @Input() messages: AiChatMessage[];
  @Input() waitingForComputerResponse: boolean;
  @Input() workgroupId: number;
}
