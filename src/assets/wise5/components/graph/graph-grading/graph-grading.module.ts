import { NgModule } from '@angular/core';
import { GraphShowWorkComponent } from '../graph-show-work/graph-show-work.component';
import { GraphGradingComponent } from './graph-grading.component';

@NgModule({
  declarations: [GraphGradingComponent],
  imports: [GraphShowWorkComponent],
  exports: [GraphGradingComponent]
})
export class GraphGradingModule {}
