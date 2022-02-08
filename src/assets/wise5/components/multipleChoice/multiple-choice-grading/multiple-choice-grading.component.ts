import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'multiple-choice-grading',
  templateUrl: 'multiple-choice-grading.component.html'
})
export class MultipleChoiceGradingComponent extends ComponentShowWorkDirective {}
