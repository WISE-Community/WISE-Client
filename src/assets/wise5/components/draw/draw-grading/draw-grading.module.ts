import { NgModule } from '@angular/core';
import { DrawShowWorkComponent } from '../draw-show-work/draw-show-work.component';
import { DrawGradingComponent } from './draw-grading.component';

@NgModule({
  declarations: [DrawGradingComponent],
  imports: [DrawShowWorkComponent],
  exports: [DrawGradingComponent]
})
export class DrawGradingModule {}
