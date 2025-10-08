import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DiscussionShowWorkComponent } from '../discussion-show-work/discussion-show-work.component';

@Component({
  imports: [DiscussionShowWorkComponent],
  template: `
    <discussion-show-work
      [nodeId]="nodeId"
      [componentId]="componentId"
      [componentState]="componentState"
      [isRevision]="isRevision"
      [workgroupId]="workgroupId"
    />
  `
})
export class DiscussionGradingComponent extends ComponentShowWorkDirective {
  @Input() workgroupId: any;
}
