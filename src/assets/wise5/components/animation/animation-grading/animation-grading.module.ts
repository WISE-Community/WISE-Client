import { NgModule } from '@angular/core';
import { AnimationGradingComponent } from './animation-grading.component';
import { AnimationShowWorkComponent } from '../animation-show-work/animation-show-work.component';

@NgModule({
  declarations: [AnimationGradingComponent],
  imports: [AnimationShowWorkComponent],
  exports: [AnimationGradingComponent]
})
export class AnimationGradingModule {}
