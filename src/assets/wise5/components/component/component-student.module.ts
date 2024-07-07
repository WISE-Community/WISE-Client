import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { PreviewComponentComponent } from '../../authoringTool/components/preview-component/preview-component.component';
import { StudentAssetsDialogModule } from '../../vle/studentAsset/student-assets-dialog/student-assets-dialog.module';
import { AnimationStudentModule } from '../animation/animation-student/animation-student.module';
import { AudioOscillatorStudentModule } from '../audioOscillator/audio-oscillator-student/audio-oscillator.module';
import { ConceptMapStudentModule } from '../conceptMap/concept-map-student/concept-map-student.module';
import { DialogGuidanceStudentModule } from '../dialogGuidance/dialogGuidanceStudentModule';
import { DiscussionStudentModule } from '../discussion/discussion-student/discussion-student.module';
import { DrawStudentModule } from '../draw/draw-student/draw-student-module';
import { EmbeddedStudentModule } from '../embedded/embedded-student/embedded-student.module';
import { GraphStudentModule } from '../graph/graph-student/graph-student.module';
import { HtmlStudentComponent } from '../html/html-student/html-student.component';
import { LabelStudentModule } from '../label/label-student/label-student.module';
import { MatchStudentModule } from '../match/match-student/match-student.module';
import { MultipleChoiceStudentModule } from '../multipleChoice/multiple-choice-student/multiple-choice-student.module';
import { OpenResponseStudentModule } from '../openResponse/open-response-student/open-response-student.module';
import { OutsideUrlStudentModule } from '../outsideURL/outside-url-student/outside-url-student.module';
import { PeerChatStudentModule } from '../peerChat/peer-chat-student/peer-chat-student.module';
import { ShowGroupWorkStudentModule } from '../showGroupWork/show-group-work-student/show-group-work-student.module';
import { ShowMyWorkStudentModule } from '../showMyWork/show-my-work-student/show-my-work-student.module';
import { SummaryStudentModule } from '../summary/summary-student/summary-student.module';
import { TableStudentModule } from '../table/table-student/table-student.module';
import { ComponentComponent } from './component.component';
import { AiChatStudentModule } from '../aiChat/ai-chat-student/ai-chat-student.module';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';

@NgModule({
  imports: [
    AiChatStudentModule,
    AnimationStudentModule,
    AudioOscillatorStudentModule,
    CommonModule,
    ComponentComponent,
    ConceptMapStudentModule,
    DialogGuidanceStudentModule,
    DiscussionStudentModule,
    DrawStudentModule,
    EmbeddedStudentModule,
    GraphStudentModule,
    HelpIconComponent,
    HighchartsChartModule,
    HtmlStudentComponent,
    LabelStudentModule,
    MatchStudentModule,
    MultipleChoiceStudentModule,
    OpenResponseStudentModule,
    OutsideUrlStudentModule,
    PeerChatStudentModule,
    PreviewComponentComponent,
    ShowGroupWorkStudentModule,
    ShowMyWorkStudentModule,
    StudentAssetsDialogModule,
    StudentComponentModule,
    SummaryStudentModule,
    TableStudentModule
  ],
  exports: [ComponentComponent, PreviewComponentComponent]
})
export class ComponentStudentModule {}
