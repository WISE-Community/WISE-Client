import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ClassResponse } from './class-response/class-response.component';
import { SaveTimeMessageComponent } from '../../common/save-time-message/save-time-message.component';

@NgModule({
  declarations: [ClassResponse],
  imports: [SaveTimeMessageComponent, StudentComponentModule, StudentTeacherCommonModule],
  exports: [ClassResponse]
})
export class DiscussionCommonModule {}
