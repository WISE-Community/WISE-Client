import { NgModule } from '@angular/core';
import { LabelGradingComponent } from './label-grading.component';
import { LabelShowWorkComponent } from '../label-show-work/label-show-work.component';

@NgModule({
  declarations: [LabelGradingComponent],
  imports: [LabelShowWorkComponent],
  exports: [LabelGradingComponent]
})
export class LabelGradingModule {}
