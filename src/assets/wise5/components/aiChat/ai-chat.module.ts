import { NgModule } from '@angular/core';
import { AiChatMessagesComponent } from './ai-chat-messages/ai-chat-messages.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { AiChatBotMessageComponent } from './ai-chat-bot-message/ai-chat-bot-message.component';
import { AiChatStudentMessageComponent } from './ai-chat-student-message/ai-chat-student-message.component';

@NgModule({
  declarations: [AiChatBotMessageComponent, AiChatStudentMessageComponent, AiChatMessagesComponent],
  imports: [StudentTeacherCommonModule],
  exports: [AiChatBotMessageComponent, AiChatStudentMessageComponent, AiChatMessagesComponent]
})
export class AiChatModule {}
