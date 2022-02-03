import { NgModule } from '@angular/core';
import { MatchShowWorkModule } from '../match-show-work/match-show-work-module';
import { MatchGradingComponent } from './match-grading.component';

@NgModule({
  declarations: [MatchGradingComponent],
  imports: [MatchShowWorkModule],
  exports: [MatchGradingComponent]
})
export class MatchGradingModule {}
