import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';
import {
  TimelineItemComponent,
  TimelineItemContent,
  TimelineItemLabel
} from './timeline-item/timeline-item.component';

@NgModule({
  imports: [TimelineComponent, TimelineItemComponent, TimelineItemContent, TimelineItemLabel],
  exports: [TimelineComponent, TimelineItemComponent, TimelineItemContent, TimelineItemLabel]
})
export class TimelineModule {}
