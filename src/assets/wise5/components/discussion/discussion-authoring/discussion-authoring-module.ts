import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionAuthoring } from './discussion-authoring.component';

@NgModule({
  declarations: [DiscussionAuthoring],
  imports: [StudentTeacherCommonModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionAuthoring]
})
export class DiscussionAuthoringModule {}
