import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { HelpIconModule } from '../../themes/default/themeComponents/helpIcon/help-icon.module';
import { StudentAssetsDialogModule } from '../../vle/studentAsset/student-assets-dialog/student-assets-dialog.module';
import { AnimationStudentModule } from '../animation/animation-student/animation-student.module';
import { AudioOscillatorStudentModule } from '../audioOscillator/audio-oscillator-student/audio-oscillator.module';
import { ConceptMapStudentModule } from '../conceptMap/concept-map-student/concept-map-student.module';
import { DialogGuidanceStudentModule } from '../dialogGuidance/dialogGuidanceStudentModule';
import { DiscussionStudentModule } from '../discussion/discussion-student/discussion-student.module';
import { DrawStudentModule } from '../draw/draw-student/draw-student-module';
import { EmbeddedStudentModule } from '../embedded/embedded-student/embedded-student.module';
import { GraphStudentModule } from '../graph/graph-student/graph-student.module';
import { HtmlStudentModule } from '../html/html-student/html-student.module';
import { LabelStudentModule } from '../label/label-student/label-student.module';
import { MatchStudentModule } from '../match/match-student/match-student.module';
import { MultipleChoiceStudentModule } from '../multipleChoice/multiple-choice-student/multiple-choice-student.module';
import { OpenResponseStudentModule } from '../openResponse/open-response-student/open-response-student.module';
import { OutsideUrlStudentModule } from '../outsideURL/outside-url-student/outside-url-student.module';
import { SummaryStudentModule } from '../summary/summary-student/summary-student.module';
import { TableStudentModule } from '../table/table-student/table-student.module';
import { ComponentComponent } from './component.component';

@NgModule({
  declarations: [ComponentComponent],
  imports: [
    AnimationStudentModule,
    AudioOscillatorStudentModule,
    CommonModule,
    ConceptMapStudentModule,
    DialogGuidanceStudentModule,
    DiscussionStudentModule,
    DrawStudentModule,
    EmbeddedStudentModule,
    GraphStudentModule,
    HelpIconModule,
    HighchartsChartModule,
    HtmlStudentModule,
    LabelStudentModule,
    MatchStudentModule,
    MultipleChoiceStudentModule,
    OpenResponseStudentModule,
    OutsideUrlStudentModule,
    StudentAssetsDialogModule,
    StudentComponentModule,
    SummaryStudentModule,
    TableStudentModule
  ],
  exports: [ComponentComponent]
})
export class ComponentStudentModule {}
