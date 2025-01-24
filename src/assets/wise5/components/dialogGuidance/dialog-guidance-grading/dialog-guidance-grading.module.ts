import { NgModule } from '@angular/core';
import { DialogGuidanceGradingComponent } from './dialog-guidance-grading.component';
import { DialogGuidanceShowWorkComponent } from '../dialog-guidance-show-work/dialog-guidance-show-work.component';

@NgModule({
  declarations: [DialogGuidanceGradingComponent],
  imports: [DialogGuidanceShowWorkComponent],
  exports: [DialogGuidanceGradingComponent]
})
export class DialogGuidanceGradingModule {}
