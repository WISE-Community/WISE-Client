import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DialogGuidanceShowWorkComponent } from '../dialog-guidance-show-work/dialog-guidance-show-work.component';
import { DetectedIdeasComponent } from '../detected-ideas/detected-ideas.component';

@Component({
  imports: [DetectedIdeasComponent, DialogGuidanceShowWorkComponent],
  selector: 'dialog-guidance-grading',
  standalone: true,
  templateUrl: './dialog-guidance-grading.component.html'
})
export class DialogGuidanceGradingComponent extends ComponentShowWorkDirective {}
