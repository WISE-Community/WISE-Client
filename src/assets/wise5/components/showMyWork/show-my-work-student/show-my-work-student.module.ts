import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { ConceptMapStudentModule } from '../../conceptMap/concept-map-student/concept-map-student.module';
import { DialogGuidanceStudentModule } from '../../dialogGuidance/dialogGuidanceStudentModule';
import { DiscussionStudentModule } from '../../discussion/discussion-student/discussion-student.module';
import { DrawStudentModule } from '../../draw/draw-student/draw-student-module';
import { EmbeddedStudentModule } from '../../embedded/embedded-student/embedded-student.module';
import { GraphStudentModule } from '../../graph/graph-student/graph-student.module';
import { LabelStudentModule } from '../../label/label-student/label-student.module';
import { MatchStudentModule } from '../../match/match-student/match-student.module';
import { MultipleChoiceStudentModule } from '../../multipleChoice/multiple-choice-student/multiple-choice-student.module';
import { OpenResponseStudentModule } from '../../openResponse/open-response-student/open-response-student.module';
import { TableStudentModule } from '../../table/table-student/table-student.module';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';

@NgModule({
  declarations: [ShowMyWorkStudentComponent],
  imports: [
    AngularJSModule,
    ConceptMapStudentModule,
    DialogGuidanceStudentModule,
    DiscussionStudentModule,
    DrawStudentModule,
    EmbeddedStudentModule,
    GraphStudentModule,
    LabelStudentModule,
    MatchStudentModule,
    MultipleChoiceStudentModule,
    OpenResponseStudentModule,
    TableStudentModule
  ],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
