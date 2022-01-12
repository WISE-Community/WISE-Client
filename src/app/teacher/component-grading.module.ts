import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnimationGrading } from '../../assets/wise5/components/animation/animation-grading/animation-grading.component';
import { AudioOscillatorGrading } from '../../assets/wise5/components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.component';
import { DialogGuidanceGradingComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-grading/dialog-guidance-grading.component';
import { DiscussionGradingModule } from '../../assets/wise5/components/discussion/discussion-grading/discussion-grading.module';
import { EmbeddedGrading } from '../../assets/wise5/components/embedded/embedded-grading/embedded-grading.component';
import { MatchGradingModule } from '../../assets/wise5/components/match/match-grading/match-grading-module';
import { PeerChatGradingComponent } from '../../assets/wise5/components/peerChat/peer-chat-grading/peer-chat-grading.component';
import { PeerChatModule } from '../../assets/wise5/components/peerChat/peer-chat.module';
import { AngularJSModule } from '../common-hybrid-angular.module';

@NgModule({
  declarations: [
    AnimationGrading,
    AudioOscillatorGrading,
    DialogGuidanceGradingComponent,
    EmbeddedGrading,
    PeerChatGradingComponent
  ],
  imports: [
    AngularJSModule,
    DiscussionGradingModule,
    HighchartsChartModule,
    MatchGradingModule,
    PeerChatModule
  ],
  exports: [
    AnimationGrading,
    AudioOscillatorGrading,
    DialogGuidanceGradingComponent,
    DiscussionGradingModule,
    EmbeddedGrading,
    MatchGradingModule,
    PeerChatGradingComponent
  ]
})
export class ComponentGradingModule {}
