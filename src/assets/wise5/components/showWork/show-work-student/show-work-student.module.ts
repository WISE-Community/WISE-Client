import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { AnimationShowWorkModule } from '../../animation/animation-show-work/animation-show-work.module';
import { AudioOscillatorShowWorkModule } from '../../audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.module';
import { ConceptMapShowWorkModule } from '../../conceptMap/concept-map-show-work/concept-map-show-work.module';
import { DialogGuidanceShowWorkModule } from '../../dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.module';
import { DiscussionStudentModule } from '../../discussion/discussion-student/discussion-student.module';
import { DrawShowWorkModule } from '../../draw/draw-show-work/draw-show-work.module';
import { EmbeddedShowWorkModule } from '../../embedded/embedded-show-work/embedded-show-work.module';
import { GraphShowWorkModule } from '../../graph/graph-show-work/graph-show-work.module';
import { LabelShowWorkModule } from '../../label/label-show-work/label-show-work.module';
import { MatchShowWorkModule } from '../../match/match-show-work/match-show-work-module';
import { MultipleChoiceShowWorkModule } from '../../multipleChoice/multiple-choice-show-work/multiple-choice-show-work.module';
import { OpenResponseShowWorkModule } from '../../openResponse/open-response-show-work/open-response-show-work.module';
import { TableShowWorkModule } from '../../table/table-show-work/table-show-work.module';
import { ShowWorkStudentComponent } from './show-work-student.component';

@NgModule({
  declarations: [ShowWorkStudentComponent],
  imports: [
    StudentTeacherCommonModule,
    AnimationShowWorkModule,
    AudioOscillatorShowWorkModule,
    ConceptMapShowWorkModule,
    DialogGuidanceShowWorkModule,
    DiscussionStudentModule,
    DrawShowWorkModule,
    EmbeddedShowWorkModule,
    GraphShowWorkModule,
    LabelShowWorkModule,
    MatchShowWorkModule,
    MultipleChoiceShowWorkModule,
    OpenResponseShowWorkModule,
    TableShowWorkModule
  ],
  exports: [ShowWorkStudentComponent]
})
export class ShowWorkStudentModule {}
