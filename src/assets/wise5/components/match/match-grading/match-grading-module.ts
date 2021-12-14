import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { MatchGrading } from './match-grading.component';
import { MatchCommonModule } from '../match-common.module';

@NgModule({
  declarations: [MatchGrading],
  imports: [AngularJSModule, MatchCommonModule],
  exports: [MatchGrading]
})
export class MatchGradingModule {}
