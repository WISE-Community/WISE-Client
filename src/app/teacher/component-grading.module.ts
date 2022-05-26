import { NgModule } from '@angular/core';
import { AnimationGradingModule } from '../../assets/wise5/components/animation/animation-grading/animation-grading.module';
import { AudioOscillatorGradingModule } from '../../assets/wise5/components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.module';
import { ConceptMapGradingModule } from '../../assets/wise5/components/conceptMap/concept-map-grading/concept-map-grading.module';
import { DialogGuidanceGradingModule } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-grading/dialog-guidance-grading.module';
import { DiscussionGradingModule } from '../../assets/wise5/components/discussion/discussion-grading/discussion-grading.module';
import { DrawGradingModule } from '../../assets/wise5/components/draw/draw-grading/draw-grading.module';
import { EmbeddedGradingModule } from '../../assets/wise5/components/embedded/embedded-grading/embedded-grading.module';
import { GraphGradingModule } from '../../assets/wise5/components/graph/graph-grading/graph-grading.module';
import { LabelGradingModule } from '../../assets/wise5/components/label/label-grading/label-grading.module';
import { MatchGradingModule } from '../../assets/wise5/components/match/match-grading/match-grading.module';
import { MultipleChoiceGradingModule } from '../../assets/wise5/components/multipleChoice/multiple-choice-grading/multiple-choice-grading.module';
import { OpenResponseGradingModule } from '../../assets/wise5/components/openResponse/open-response-grading/open-response-grading.module';
import { PeerChatGradingModule } from '../../assets/wise5/components/peerChat/peer-chat-grading/peer-chat-grading.module';
import { TableGradingModule } from '../../assets/wise5/components/table/table-grading/table-grading.module';

@NgModule({
  imports: [
    AnimationGradingModule,
    AudioOscillatorGradingModule,
    ConceptMapGradingModule,
    DialogGuidanceGradingModule,
    DiscussionGradingModule,
    DrawGradingModule,
    EmbeddedGradingModule,
    GraphGradingModule,
    LabelGradingModule,
    MatchGradingModule,
    MultipleChoiceGradingModule,
    OpenResponseGradingModule,
    PeerChatGradingModule,
    TableGradingModule
  ],
  exports: [
    AnimationGradingModule,
    AudioOscillatorGradingModule,
    ConceptMapGradingModule,
    DialogGuidanceGradingModule,
    DiscussionGradingModule,
    DrawGradingModule,
    EmbeddedGradingModule,
    GraphGradingModule,
    LabelGradingModule,
    MatchGradingModule,
    MultipleChoiceGradingModule,
    OpenResponseGradingModule,
    PeerChatGradingModule,
    TableGradingModule
  ]
})
export class ComponentGradingModule {}
