import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionShowWorkComponent } from './discussion-show-work.component';

@NgModule({
  declarations: [DiscussionShowWorkComponent],
  imports: [AngularJSModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionShowWorkComponent]
})
export class DiscussionShowWorkModule {}
