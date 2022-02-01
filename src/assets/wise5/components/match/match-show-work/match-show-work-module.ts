import { NgModule } from '@angular/core';
import { MatchCommonModule } from '../match-common.module';
import { MatchShowWorkComponent } from './match-show-work.component';

@NgModule({
  declarations: [MatchShowWorkComponent],
  imports: [MatchCommonModule],
  exports: [MatchShowWorkComponent]
})
export class MatchShowWorkModule {}
