import { NgModule } from '@angular/core';
import { AnimationShowWorkModule } from '../../animation/animation-show-work/animation-show-work.module';
import { AudioOscillatorShowWorkModule } from '../../audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.module';
import { ConceptMapShowWorkModule } from '../../conceptMap/concept-map-show-work/concept-map-show-work.module';
import { DiscussionStudentModule } from '../../discussion/discussion-student/discussion-student.module';
import { DrawShowWorkModule } from '../../draw/draw-show-work/draw-show-work.module';
import { EmbeddedShowWorkModule } from '../../embedded/embedded-show-work/embedded-show-work.module';
import { GraphShowWorkModule } from '../../graph/graph-show-work/graph-show-work.module';
import { LabelShowWorkModule } from '../../label/label-show-work/label-show-work.module';
import { OpenResponseShowWorkModule } from '../../openResponse/open-response-show-work/open-response-show-work.module';
import { TableShowWorkModule } from '../../table/table-show-work/table-show-work.module';
import { ShowWorkStudentComponent } from './show-work-student.component';
import { MultipleChoiceShowWorkComponent } from '../../multipleChoice/multiple-choice-show-work/multiple-choice-show-work.component';
import { DialogGuidanceShowWorkComponent } from '../../dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.component';
import { MatchShowWorkComponent } from '../../match/match-show-work/match-show-work.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ShowWorkStudentComponent],
  imports: [
    CommonModule,
    AnimationShowWorkModule,
    AudioOscillatorShowWorkModule,
    ConceptMapShowWorkModule,
    DialogGuidanceShowWorkComponent,
    DiscussionStudentModule,
    DrawShowWorkModule,
    EmbeddedShowWorkModule,
    GraphShowWorkModule,
    LabelShowWorkModule,
    MatchShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkModule,
    TableShowWorkModule
  ],
  exports: [ShowWorkStudentComponent]
})
export class ShowWorkStudentModule {}
