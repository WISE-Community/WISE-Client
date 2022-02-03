import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'match-grading',
  templateUrl: 'match-grading.component.html'
})
export class MatchGradingComponent extends ComponentShowWorkDirective {}
