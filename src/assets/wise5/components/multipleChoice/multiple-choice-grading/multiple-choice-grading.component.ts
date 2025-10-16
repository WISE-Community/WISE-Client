import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MultipleChoiceShowWorkComponent } from '../multiple-choice-show-work/multiple-choice-show-work.component';

@Component({
  imports: [MultipleChoiceShowWorkComponent],
  selector: 'multiple-choice-grading',
  templateUrl: 'multiple-choice-grading.component.html'
})
export class MultipleChoiceGradingComponent extends ComponentShowWorkDirective {}
