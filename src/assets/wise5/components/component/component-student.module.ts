import { NgModule } from '@angular/core';
import { AnimationStudent } from '../animation/animation-student/animation-student.component';
import { ConceptMapStudent } from '../conceptMap/concept-map-student/concept-map-student.component';
import { DiscussionStudent } from '../discussion/discussion-student/discussion-student.component';
import { HtmlStudentComponent } from '../html/html-student/html-student.component';
import { LabelStudentComponent } from '../label/label-student/label-student.component';
import { ShowGroupWorkStudentModule } from '../showGroupWork/show-group-work-student/show-group-work-student.module';
import { ShowMyWorkStudentModule } from '../showMyWork/show-my-work-student/show-my-work-student.module';
import { TableStudentComponent } from '../table/table-student/table-student.component';
import { MultipleChoiceStudentComponent } from '../multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { DialogGuidanceStudentComponent } from '../dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { StudentAssetsDialogComponent } from '../../vle/studentAsset/student-assets-dialog/student-assets-dialog.component';
import { AudioOscillatorStudent } from '../audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { DrawStudent } from '../draw/draw-student/draw-student.component';
import { EmbeddedStudent } from '../embedded/embedded-student/embedded-student.component';
import { GraphStudent } from '../graph/graph-student/graph-student.component';
import { OutsideUrlStudent } from '../outsideURL/outside-url-student/outside-url-student.component';
import { PeerChatStudentComponent } from '../peerChat/peer-chat-student/peer-chat-student.component';
import { SummaryStudent } from '../summary/summary-student/summary-student.component';
import { MatchStudent } from '../match/match-student/match-student.component';
import { OpenResponseStudent } from '../openResponse/open-response-student/open-response-student.component';

@NgModule({
  imports: [
    AnimationStudent,
    AudioOscillatorStudent,
    ConceptMapStudent,
    DialogGuidanceStudentComponent,
    DiscussionStudent,
    DrawStudent,
    EmbeddedStudent,
    GraphStudent,
    HtmlStudentComponent,
    LabelStudentComponent,
    MatchStudent,
    MultipleChoiceStudentComponent,
    OpenResponseStudent,
    OutsideUrlStudent,
    PeerChatStudentComponent,
    ShowGroupWorkStudentModule,
    ShowMyWorkStudentModule,
    StudentAssetsDialogComponent,
    SummaryStudent,
    TableStudentComponent
  ]
})
export class ComponentStudentModule {}
