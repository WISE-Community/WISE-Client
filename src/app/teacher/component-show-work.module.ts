import { NgModule } from '@angular/core';
import { AudioOscillatorShowWorkModule } from '../../assets/wise5/components/audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.module';
import { ConceptMapShowWorkModule } from '../../assets/wise5/components/conceptMap/concept-map-show-work/concept-map-show-work.module';
import { DiscussionShowWorkModule } from '../../assets/wise5/components/discussion/discussion-show-work/discussion-show-work.module';
import { DrawShowWorkModule } from '../../assets/wise5/components/draw/draw-show-work/draw-show-work.module';
import { EmbeddedShowWorkModule } from '../../assets/wise5/components/embedded/embedded-show-work/embedded-show-work.module';
import { GraphShowWorkModule } from '../../assets/wise5/components/graph/graph-show-work/graph-show-work.module';
import { OpenResponseShowWorkModule } from '../../assets/wise5/components/openResponse/open-response-show-work/open-response-show-work.module';
import { TableShowWorkModule } from '../../assets/wise5/components/table/table-show-work/table-show-work.module';
import { MultipleChoiceShowWorkComponent } from '../../assets/wise5/components/multipleChoice/multiple-choice-show-work/multiple-choice-show-work.component';
import { DialogGuidanceShowWorkComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.component';
import { MatchShowWorkComponent } from '../../assets/wise5/components/match/match-show-work/match-show-work.component';
import { LabelShowWorkComponent } from '../../assets/wise5/components/label/label-show-work/label-show-work.component';
import { AnimationShowWorkComponent } from '../../assets/wise5/components/animation/animation-show-work/animation-show-work.component';

@NgModule({
  imports: [
    AnimationShowWorkComponent,
    AudioOscillatorShowWorkModule,
    ConceptMapShowWorkModule,
    DialogGuidanceShowWorkComponent,
    DiscussionShowWorkModule,
    DrawShowWorkModule,
    EmbeddedShowWorkModule,
    GraphShowWorkModule,
    LabelShowWorkComponent,
    MatchShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkModule,
    TableShowWorkModule
  ],
  exports: [
    AudioOscillatorShowWorkModule,
    ConceptMapShowWorkModule,
    DialogGuidanceShowWorkComponent,
    DiscussionShowWorkModule,
    DrawShowWorkModule,
    EmbeddedShowWorkModule,
    GraphShowWorkModule,
    LabelShowWorkComponent,
    MatchShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkModule,
    TableShowWorkModule
  ]
})
export class ComponentShowWorkModule {}
