import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { PreviewComponentComponent } from '../../authoringTool/components/preview-component/preview-component.component';
import { AnimationStudent } from '../animation/animation-student/animation-student.component';
import { ConceptMapStudent } from '../conceptMap/concept-map-student/concept-map-student.component';
import { DiscussionStudent } from '../discussion/discussion-student/discussion-student.component';
import { HtmlStudentComponent } from '../html/html-student/html-student.component';
import { LabelStudentComponent } from '../label/label-student/label-student.component';
import { MatchStudentModule } from '../match/match-student/match-student.module';
import { OpenResponseStudentModule } from '../openResponse/open-response-student/open-response-student.module';
import { PeerChatStudentModule } from '../peerChat/peer-chat-student/peer-chat-student.module';
import { ShowGroupWorkStudentModule } from '../showGroupWork/show-group-work-student/show-group-work-student.module';
import { ShowMyWorkStudentModule } from '../showMyWork/show-my-work-student/show-my-work-student.module';
import { SummaryStudentModule } from '../summary/summary-student/summary-student.module';
import { TableStudentComponent } from '../table/table-student/table-student.component';
import { ComponentComponent } from './component.component';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';
import { MultipleChoiceStudentComponent } from '../multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { DialogGuidanceStudentComponent } from '../dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { StudentAssetsDialogComponent } from '../../vle/studentAsset/student-assets-dialog/student-assets-dialog.component';
import { AiChatStudentComponent } from '../aiChat/ai-chat-student/ai-chat-student.component';
import { AudioOscillatorStudent } from '../audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { DrawStudent } from '../draw/draw-student/draw-student.component';
import { EmbeddedStudent } from '../embedded/embedded-student/embedded-student.component';
import { GraphStudent } from '../graph/graph-student/graph-student.component';
import { OutsideUrlStudent } from '../outsideURL/outside-url-student/outside-url-student.component';

@NgModule({
  imports: [
    AiChatStudentComponent,
    AnimationStudent,
    AudioOscillatorStudent,
    CommonModule,
    ComponentComponent,
    ConceptMapStudent,
    DialogGuidanceStudentComponent,
    DiscussionStudent,
    DrawStudent,
    EmbeddedStudent,
    GraphStudent,
    HelpIconComponent,
    HighchartsChartModule,
    HtmlStudentComponent,
    LabelStudentComponent,
    MatchStudentModule,
    MultipleChoiceStudentComponent,
    OpenResponseStudentModule,
    OutsideUrlStudent,
    PeerChatStudentModule,
    PreviewComponentComponent,
    ShowGroupWorkStudentModule,
    ShowMyWorkStudentModule,
    StudentAssetsDialogComponent,
    StudentComponentModule,
    SummaryStudentModule,
    TableStudentComponent
  ],
  exports: [ComponentComponent, PreviewComponentComponent]
})
export class ComponentStudentModule {}
