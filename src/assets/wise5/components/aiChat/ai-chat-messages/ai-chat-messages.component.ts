import { Component, Input } from '@angular/core';
import { AiChatMessage } from '../AiChatMessage';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { AiChatStudentMessageComponent } from '../ai-chat-student-message/ai-chat-student-message.component';
import { AiChatBotMessageComponent } from '../ai-chat-bot-message/ai-chat-bot-message.component';

@Component({
  imports: [AiChatStudentMessageComponent, AiChatBotMessageComponent],
  selector: 'ai-chat-messages',
  styleUrl: './ai-chat-messages.component.scss',
  templateUrl: './ai-chat-messages.component.html'
})
export class AiChatMessagesComponent {
  @Input() computerAvatar: ComputerAvatar;
  @Input() messages: AiChatMessage[];
  @Input() waitingForComputerResponse: boolean;
  @Input() workgroupId: number;
}
