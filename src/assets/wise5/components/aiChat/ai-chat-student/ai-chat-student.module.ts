import { NgModule } from '@angular/core';
import { AiChatStudentComponent } from './ai-chat-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { AiChatModule } from '../ai-chat.module';
import { ComputerAvatarSelectorModule } from '../../../vle/computer-avatar-selector/computer-avatar-selector.module';
import { ChatInputComponent } from '../../../common/chat-input/chat-input.component';

@NgModule({
  declarations: [AiChatStudentComponent],
  imports: [
    AiChatModule,
    ChatInputComponent,
    ComputerAvatarSelectorModule,
    StudentComponentModule,
    StudentTeacherCommonModule
  ],
  exports: [AiChatStudentComponent]
})
export class AiChatStudentModule {}
