import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'discussion-grading',
  templateUrl: 'discussion-grading.component.html'
})
export class DiscussionGradingComponent extends ComponentShowWorkDirective {
  @Input() workgroupId: any;
}
