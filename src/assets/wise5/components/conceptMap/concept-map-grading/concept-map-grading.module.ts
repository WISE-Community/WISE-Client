import { NgModule } from '@angular/core';
import { ConceptMapShowWorkModule } from '../concept-map-show-work/concept-map-show-work.module';
import { ConceptMapGradingComponent } from './concept-map-grading.component';

@NgModule({
  declarations: [ConceptMapGradingComponent],
  imports: [ConceptMapShowWorkModule],
  exports: [ConceptMapGradingComponent]
})
export class ConceptMapGradingModule {}
