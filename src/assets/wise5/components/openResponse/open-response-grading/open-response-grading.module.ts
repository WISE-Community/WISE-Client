import { NgModule } from '@angular/core';
import { OpenResponseGradingComponent } from './open-response-grading.component';
import { OpenResponseShowWorkComponent } from '../open-response-show-work/open-response-show-work.component';

@NgModule({
  declarations: [OpenResponseGradingComponent],
  imports: [OpenResponseShowWorkComponent],
  exports: [OpenResponseGradingComponent]
})
export class OpenResponseGradingModule {}
