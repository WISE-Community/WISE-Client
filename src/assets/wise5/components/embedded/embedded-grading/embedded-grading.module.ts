import { NgModule } from '@angular/core';
import { EmbeddedShowWorkModule } from '../embedded-show-work/embedded-show-work.module';
import { EmbeddedGradingComponent } from './embedded-grading.component';

@NgModule({
  declarations: [EmbeddedGradingComponent],
  imports: [EmbeddedShowWorkModule],
  exports: [EmbeddedGradingComponent]
})
export class EmbeddedGradingModule {}
