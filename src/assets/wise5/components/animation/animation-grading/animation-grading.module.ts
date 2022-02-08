import { NgModule } from '@angular/core';
import { AnimationShowWorkModule } from '../animation-show-work/animation-show-work.module';
import { AnimationGradingComponent } from './animation-grading.component';

@NgModule({
  declarations: [AnimationGradingComponent],
  imports: [AnimationShowWorkModule],
  exports: [AnimationGradingComponent]
})
export class AnimationGradingModule {}
