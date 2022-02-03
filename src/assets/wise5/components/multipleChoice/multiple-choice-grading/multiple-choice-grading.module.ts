import { NgModule } from '@angular/core';
import { MultipleChoiceShowWorkModule } from '../multiple-choice-show-work/multiple-choice-show-work.module';
import { MultipleChoiceGradingComponent } from './multiple-choice-grading.component';

@NgModule({
  declarations: [MultipleChoiceGradingComponent],
  imports: [MultipleChoiceShowWorkModule],
  exports: [MultipleChoiceGradingComponent]
})
export class MultipleChoiceGradingModule {}
