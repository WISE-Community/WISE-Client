import { NgModule } from '@angular/core';
import { AiChatMessagesComponent } from './ai-chat-messages/ai-chat-messages.component';
import { AiChatBotMessageComponent } from './ai-chat-bot-message/ai-chat-bot-message.component';
import { AiChatStudentMessageComponent } from './ai-chat-student-message/ai-chat-student-message.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AiChatBotMessageComponent, AiChatStudentMessageComponent, AiChatMessagesComponent],
  imports: [CommonModule, MatIconModule],
  exports: [AiChatBotMessageComponent, AiChatStudentMessageComponent, AiChatMessagesComponent]
})
export class AiChatModule {}
