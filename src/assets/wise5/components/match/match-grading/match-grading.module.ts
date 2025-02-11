import { NgModule } from '@angular/core';
import { MatchGradingComponent } from './match-grading.component';
import { MatchShowWorkComponent } from '../match-show-work/match-show-work.component';

@NgModule({
  declarations: [MatchGradingComponent],
  imports: [MatchShowWorkComponent],
  exports: [MatchGradingComponent]
})
export class MatchGradingModule {}
