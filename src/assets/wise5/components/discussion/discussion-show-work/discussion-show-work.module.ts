import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionCommonModule } from '../discussion-common.module';
import { DiscussionShowWorkComponent } from './discussion-show-work.component';

@NgModule({
  declarations: [DiscussionShowWorkComponent],
  imports: [CommonModule, DiscussionCommonModule, StudentComponentModule],
  exports: [DiscussionShowWorkComponent]
})
export class DiscussionShowWorkModule {}
