import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionStudent } from './discussion-student.component';

@NgModule({
  declarations: [DiscussionStudent],
  imports: [StudentTeacherCommonModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionStudent]
})
export class DiscussionStudentModule {}
