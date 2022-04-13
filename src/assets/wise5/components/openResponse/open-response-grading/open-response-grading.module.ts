import { NgModule } from '@angular/core';
import { OpenResponseShowWorkModule } from '../open-response-show-work/open-response-show-work.module';
import { OpenResponseGradingComponent } from './open-response-grading.component';

@NgModule({
  declarations: [OpenResponseGradingComponent],
  imports: [OpenResponseShowWorkModule],
  exports: [OpenResponseGradingComponent]
})
export class OpenResponseGradingModule {}
