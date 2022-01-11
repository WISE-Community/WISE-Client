import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionAuthoring } from './discussion-authoring.component';

@NgModule({
  declarations: [DiscussionAuthoring],
  imports: [AngularJSModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionAuthoring]
})
export class DiscussionAuthoringModule {}
