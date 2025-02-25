import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DialogGuidanceShowWorkComponent } from '../dialog-guidance-show-work/dialog-guidance-show-work.component';

@Component({
  imports: [DialogGuidanceShowWorkComponent],
  selector: 'dialog-guidance-grading',
  templateUrl: './dialog-guidance-grading.component.html'
})
export class DialogGuidanceGradingComponent extends ComponentShowWorkDirective {}
