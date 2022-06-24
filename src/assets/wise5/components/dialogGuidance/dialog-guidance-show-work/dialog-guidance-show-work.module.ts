import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { DialogGuidanceShowWorkComponent } from './dialog-guidance-show-work.component';

@NgModule({
  declarations: [DialogGuidanceShowWorkComponent],
  imports: [StudentTeacherCommonModule],
  exports: [DialogGuidanceShowWorkComponent]
})
export class DialogGuidanceShowWorkModule {}
