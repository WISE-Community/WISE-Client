import { NgModule } from '@angular/core';
import { ConceptMapGradingComponent } from './concept-map-grading.component';
import { ConceptMapShowWorkComponent } from '../concept-map-show-work/concept-map-show-work.component';

@NgModule({
  declarations: [ConceptMapGradingComponent],
  imports: [ConceptMapShowWorkComponent],
  exports: [ConceptMapGradingComponent]
})
export class ConceptMapGradingModule {}
