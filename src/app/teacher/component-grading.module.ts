import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnimationShowWorkComponent } from '../../assets/wise5/components/animation/animation-show-work/animation-show-work.component';
import { AudioOscillatorShowWorkComponent } from '../../assets/wise5/components/audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.component';
import { ConceptMapShowWorkComponent } from '../../assets/wise5/components/conceptMap/concept-map-show-work/concept-map-show-work.component';
import { DialogGuidanceShowWorkComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.component';
import { DiscussionShowWorkModule } from '../../assets/wise5/components/discussion/discussion-show-work/discussion-show-work.module';
import { DrawShowWorkComponent } from '../../assets/wise5/components/draw/draw-show-work/draw-show-work.component';
import { EmbeddedShowWorkComponent } from '../../assets/wise5/components/embedded/embedded-show-work/embedded-show-work.component';
import { GraphShowWorkComponent } from '../../assets/wise5/components/graph/graph-show-work/graph-show-work.component';
import { LabelShowWorkComponent } from '../../assets/wise5/components/label/label-show-work/label-show-work.component';
import { MatchShowWorkModule } from '../../assets/wise5/components/match/match-show-work/match-show-work-module';
import { MultipleChoiceShowWorkComponent } from '../../assets/wise5/components/multipleChoice/multiple-choice-show-work/multiple-choice-show-work.component';
import { OpenResponseShowWorkComponent } from '../../assets/wise5/components/openResponse/open-response-show-work/open-response-show-work.component';
import { TableShowWorkComponent } from '../../assets/wise5/components/table/table-show-work/table-show-work.component';
import { AngularJSModule } from '../common-hybrid-angular.module';

@NgModule({
  declarations: [
    AnimationShowWorkComponent,
    AudioOscillatorShowWorkComponent,
    ConceptMapShowWorkComponent,
    DialogGuidanceShowWorkComponent,
    DrawShowWorkComponent,
    EmbeddedShowWorkComponent,
    GraphShowWorkComponent,
    LabelShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkComponent,
    TableShowWorkComponent
  ],
  imports: [AngularJSModule, DiscussionShowWorkModule, HighchartsChartModule, MatchShowWorkModule],
  exports: [
    AnimationShowWorkComponent,
    AudioOscillatorShowWorkComponent,
    ConceptMapShowWorkComponent,
    DialogGuidanceShowWorkComponent,
    DiscussionShowWorkModule,
    DrawShowWorkComponent,
    EmbeddedShowWorkComponent,
    GraphShowWorkComponent,
    LabelShowWorkComponent,
    MatchShowWorkModule,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkComponent,
    TableShowWorkComponent
  ]
})
export class ComponentGradingModule {}
