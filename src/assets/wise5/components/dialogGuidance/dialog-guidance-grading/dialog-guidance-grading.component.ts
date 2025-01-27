import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DialogGuidanceShowWorkComponent } from '../dialog-guidance-show-work/dialog-guidance-show-work.component';

@Component({
  imports: [DialogGuidanceShowWorkComponent],
  selector: 'dialog-guidance-grading',
  standalone: true,
  template: `<dialog-guidance-show-work
    [nodeId]="nodeId"
    [componentId]="componentId"
    [componentState]="componentState"
    [isRevision]="isRevision"
  />`
})
export class DialogGuidanceGradingComponent extends ComponentShowWorkDirective {}
