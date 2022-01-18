import { NgModule } from '@angular/core';
import { MatchGrading } from './match-grading.component';
import { MatchCommonModule } from '../match-common.module';

@NgModule({
  declarations: [MatchGrading],
  imports: [MatchCommonModule],
  exports: [MatchGrading]
})
export class MatchGradingModule {}
