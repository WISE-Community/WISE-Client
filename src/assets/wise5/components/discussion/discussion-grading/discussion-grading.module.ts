import { NgModule } from '@angular/core';
import { DiscussionShowWorkComponent } from '../discussion-show-work/discussion-show-work.component';
import { DiscussionGradingComponent } from './discussion-grading.component';

@NgModule({
  declarations: [DiscussionGradingComponent],
  imports: [DiscussionShowWorkComponent],
  exports: [DiscussionGradingComponent]
})
export class DiscussionGradingModule {}
