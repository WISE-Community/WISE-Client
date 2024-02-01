import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DialogGuidanceFeedbackService } from '../../services/dialogGuidanceFeedbackService';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { ComputerAvatarSelectorModule } from '../../vle/computer-avatar-selector/computer-avatar-selector.module';

@NgModule({
  declarations: [DialogGuidanceStudentComponent],
  imports: [
    ComputerAvatarSelectorModule,
    MatButtonToggleModule,
    StudentComponentModule,
    StudentTeacherCommonModule
  ],
  providers: [DialogGuidanceFeedbackService],
  exports: [DialogGuidanceStudentComponent]
})
export class DialogGuidanceStudentModule {}
