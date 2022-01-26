import { NgModule } from '@angular/core';
import { GraphShowWorkModule } from '../graph-show-work/graph-show-work.module';
import { GraphGradingComponent } from './graph-grading.component';

@NgModule({
  declarations: [GraphGradingComponent],
  imports: [GraphShowWorkModule],
  exports: [GraphGradingComponent]
})
export class GraphGradingModule {}
