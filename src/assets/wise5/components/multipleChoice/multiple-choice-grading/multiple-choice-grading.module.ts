import { NgModule } from '@angular/core';
import { MultipleChoiceGradingComponent } from './multiple-choice-grading.component';
import { MultipleChoiceShowWorkComponent } from '../multiple-choice-show-work/multiple-choice-show-work.component';

@NgModule({
  declarations: [MultipleChoiceGradingComponent],
  imports: [MultipleChoiceShowWorkComponent],
  exports: [MultipleChoiceGradingComponent]
})
export class MultipleChoiceGradingModule {}
