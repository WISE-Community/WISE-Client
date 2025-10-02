import { NgModule } from '@angular/core';
import { EmbeddedGradingComponent } from './embedded-grading.component';
import { EmbeddedShowWorkComponent } from '../embedded-show-work/embedded-show-work.component';

@NgModule({
  declarations: [EmbeddedGradingComponent],
  imports: [EmbeddedShowWorkComponent],
  exports: [EmbeddedGradingComponent]
})
export class EmbeddedGradingModule {}
