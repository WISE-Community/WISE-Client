import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'draw-grading',
  templateUrl: 'draw-grading.component.html'
})
export class DrawGradingComponent extends ComponentShowWorkDirective {}
