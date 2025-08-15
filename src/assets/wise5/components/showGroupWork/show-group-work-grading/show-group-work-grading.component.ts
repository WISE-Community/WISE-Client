import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'show-group-work-grading',
  standalone: false,
  template: `
    <show-group-work-display
      [componentId]="componentId"
      [componentContent]="componentContent"
      [nodeId]="nodeId"
      [workgroupId]="workgroupId"
    />
  `
})
export class ShowGroupWorkGradingComponent extends ComponentShowWorkDirective {
  @Input() workgroupId: number;
}
