import { NgModule } from '@angular/core';
import { DrawShowWorkModule } from '../draw-show-work/draw-show-work.module';
import { DrawGradingComponent } from './draw-grading.component';

@NgModule({
  declarations: [DrawGradingComponent],
  imports: [DrawShowWorkModule],
  exports: [DrawGradingComponent]
})
export class DrawGradingModule {}
