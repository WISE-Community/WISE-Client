import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionStudent } from './discussion-student.component';

@NgModule({
  declarations: [DiscussionStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [DiscussionStudent]
})
export class DiscussionStudentModule {}
