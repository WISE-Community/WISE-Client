import { NgModule } from '@angular/core';
import { DiscussionShowWorkModule } from '../discussion-show-work/discussion-show-work.module';
import { DiscussionGradingComponent } from './discussion-grading.component';

@NgModule({
  declarations: [DiscussionGradingComponent],
  imports: [DiscussionShowWorkModule],
  exports: [DiscussionGradingComponent]
})
export class DiscussionGradingModule {}
