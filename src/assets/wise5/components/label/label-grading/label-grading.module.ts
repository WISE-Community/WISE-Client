import { NgModule } from '@angular/core';
import { LabelShowWorkModule } from '../label-show-work/label-show-work.module';
import { LabelGradingComponent } from './label-grading.component';

@NgModule({
  declarations: [LabelGradingComponent],
  imports: [LabelShowWorkModule],
  exports: [LabelGradingComponent]
})
export class LabelGradingModule {}
