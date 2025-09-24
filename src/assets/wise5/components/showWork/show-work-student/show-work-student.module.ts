import { NgModule } from '@angular/core';
import { AnimationShowWorkComponent } from '../../animation/animation-show-work/animation-show-work.component';
import { DiscussionStudentModule } from '../../discussion/discussion-student/discussion-student.module';
import { EmbeddedShowWorkComponent } from '../../embedded/embedded-show-work/embedded-show-work.component';
import { OpenResponseShowWorkModule } from '../../openResponse/open-response-show-work/open-response-show-work.module';
import { ShowWorkStudentComponent } from './show-work-student.component';
import { MultipleChoiceShowWorkComponent } from '../../multipleChoice/multiple-choice-show-work/multiple-choice-show-work.component';
import { DialogGuidanceShowWorkComponent } from '../../dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.component';
import { MatchShowWorkComponent } from '../../match/match-show-work/match-show-work.component';
import { CommonModule } from '@angular/common';
import { LabelShowWorkComponent } from '../../label/label-show-work/label-show-work.component';
import { AudioOscillatorShowWorkComponent } from '../../audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.component';
import { ConceptMapShowWorkComponent } from '../../conceptMap/concept-map-show-work/concept-map-show-work.component';
import { DrawShowWorkComponent } from '../../draw/draw-show-work/draw-show-work.component';
import { GraphShowWorkComponent } from '../../graph/graph-show-work/graph-show-work.component';
import { TableShowWorkComponent } from '../../table/table-show-work/table-show-work.component';

@NgModule({
  declarations: [ShowWorkStudentComponent],
  imports: [
    CommonModule,
    AnimationShowWorkComponent,
    AudioOscillatorShowWorkComponent,
    ConceptMapShowWorkComponent,
    DialogGuidanceShowWorkComponent,
    DiscussionStudentModule,
    DrawShowWorkComponent,
    EmbeddedShowWorkComponent,
    GraphShowWorkComponent,
    LabelShowWorkComponent,
    MatchShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkModule,
    TableShowWorkComponent
  ],
  exports: [ShowWorkStudentComponent]
})
export class ShowWorkStudentModule {}
