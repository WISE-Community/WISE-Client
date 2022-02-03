import { NgModule } from '@angular/core';
import { DialogGuidanceShowWorkModule } from '../dialog-guidance-show-work/dialog-guidance-show-work.module';
import { DialogGuidanceGradingComponent } from './dialog-guidance-grading.component';

@NgModule({
  declarations: [DialogGuidanceGradingComponent],
  imports: [DialogGuidanceShowWorkModule],
  exports: [DialogGuidanceGradingComponent]
})
export class DialogGuidanceGradingModule {}
