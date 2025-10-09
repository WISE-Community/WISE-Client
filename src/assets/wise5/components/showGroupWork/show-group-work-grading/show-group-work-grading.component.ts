import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ShowGroupWorkDisplayComponent } from '../show-group-work-display/show-group-work-display.component';

@Component({
  imports: [ShowGroupWorkDisplayComponent],
  selector: 'show-group-work-grading',
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
