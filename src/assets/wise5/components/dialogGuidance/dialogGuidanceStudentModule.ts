import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ComputerAvatarSelectorComponent } from '../../vle/computer-avatar-selector/computer-avatar-selector.component';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DialogGuidanceFeedbackService } from '../../services/dialogGuidanceFeedbackService';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [ComputerAvatarSelectorComponent, DialogGuidanceStudentComponent],
  imports: [StudentTeacherCommonModule, MatButtonToggleModule, StudentComponentModule],
  providers: [DialogGuidanceFeedbackService],
  exports: [DialogGuidanceStudentComponent]
})
export class DialogGuidanceStudentModule {}
