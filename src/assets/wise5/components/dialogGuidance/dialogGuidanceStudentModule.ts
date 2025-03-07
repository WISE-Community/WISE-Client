import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DialogGuidanceFeedbackService } from '../../services/dialogGuidanceFeedbackService';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { ComputerAvatarSelectorComponent } from '../../vle/computer-avatar-selector/computer-avatar-selector.component';
import { ChatInputComponent } from '../../common/chat-input/chat-input.component';

@NgModule({
  declarations: [DialogGuidanceStudentComponent],
  imports: [
    ChatInputComponent,
    ComputerAvatarSelectorComponent,
    MatButtonToggleModule,
    StudentComponentModule,
    StudentTeacherCommonModule
  ],
  providers: [DialogGuidanceFeedbackService],
  exports: [DialogGuidanceStudentComponent]
})
export class DialogGuidanceStudentModule {}
