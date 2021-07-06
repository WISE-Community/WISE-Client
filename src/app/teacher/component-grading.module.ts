import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnimationGrading } from '../../assets/wise5/components/animation/animation-grading/animation-grading.component';
import { AudioOscillatorGrading } from '../../assets/wise5/components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.component';
import { ConceptMapGrading } from '../../assets/wise5/components/conceptMap/concept-map-grading/concept-map-grading.component';
import { DiscussionGrading } from '../../assets/wise5/components/discussion/discussion-grading/discussion-grading.component';
import { DrawGrading } from '../../assets/wise5/components/draw/draw-grading/draw-grading.component';
import { EmbeddedGrading } from '../../assets/wise5/components/embedded/embedded-grading/embedded-grading.component';
import { GraphGrading } from '../../assets/wise5/components/graph/graph-grading/graph-grading.component';
import { LabelGrading } from '../../assets/wise5/components/label/label-grading/label-grading.component';
import { MatchGrading } from '../../assets/wise5/components/match/match-grading/match-grading.component';
import { MultipleChoiceGrading } from '../../assets/wise5/components/multipleChoice/multiple-choice-grading/multiple-choice-grading.component';
import { OpenResponseGrading } from '../../assets/wise5/components/openResponse/open-response-grading/open-response-grading.component';
import { TableGrading } from '../../assets/wise5/components/table/table-grading/table-grading.component';
import { AngularJSModule } from '../common-hybrid-angular.module';

@NgModule({
  declarations: [
    AnimationGrading,
    AudioOscillatorGrading,
    ConceptMapGrading,
    DrawGrading,
    DiscussionGrading,
    EmbeddedGrading,
    GraphGrading,
    LabelGrading,
    MatchGrading,
    MultipleChoiceGrading,
    OpenResponseGrading,
    TableGrading
  ],
  imports: [AngularJSModule, HighchartsChartModule],
  exports: [
    AnimationGrading,
    AudioOscillatorGrading,
    ConceptMapGrading,
    DrawGrading,
    DiscussionGrading,
    EmbeddedGrading,
    GraphGrading,
    LabelGrading,
    MatchGrading,
    MultipleChoiceGrading,
    OpenResponseGrading,
    TableGrading
  ]
})
export class ComponentGradingModule {}
