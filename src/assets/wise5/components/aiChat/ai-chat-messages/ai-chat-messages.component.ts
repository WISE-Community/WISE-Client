import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';

@Component({
  selector: 'ai-chat-messages',
  standalone: false,
  styleUrl: './ai-chat-messages.component.scss',
  templateUrl: './ai-chat-messages.component.html'
})
export class AiChatMessagesComponent {
  @Input() computerAvatar: ComputerAvatar;
  @Input() messages: AiChatMessage[];
  @Input() waitingForComputerResponse: boolean;
  @Input() workgroupId: number;
}
