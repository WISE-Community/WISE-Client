import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionGrading } from './discussion-grading.component';

@NgModule({
  declarations: [DiscussionGrading],
  imports: [AngularJSModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionGrading]
})
export class DiscussionGradingModule {}
