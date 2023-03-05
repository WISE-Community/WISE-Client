import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'show-group-work-grading',
  templateUrl: './show-group-work-grading.component.html',
  styleUrls: ['./show-group-work-grading.component.scss']
})
export class ShowGroupWorkGradingComponent extends ComponentShowWorkDirective {
  @Input() workgroupId: number;
}
