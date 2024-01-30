import { NgModule } from '@angular/core';
import { AiChatStudentComponent } from './ai-chat-student.component';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { AiChatModule } from '../ai-chat.module';

@NgModule({
  declarations: [AiChatStudentComponent],
  imports: [AiChatModule, StudentComponentModule, StudentTeacherCommonModule],
  exports: [AiChatStudentComponent]
})
export class AiChatStudentModule {}
