import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';
import { ComputerAvatar } from '../../../common/ComputerAvatar';

@Component({
  selector: 'ai-chat-messages',
  templateUrl: './ai-chat-messages.component.html',
  styleUrls: ['./ai-chat-messages.component.scss']
})
export class AiChatMessagesComponent {
  @Input() computerAvatar: ComputerAvatar;
  @Input() messages: AiChatMessage[];
  @Input() waitingForComputerResponse: boolean;
  @Input() workgroupId: number;
}
