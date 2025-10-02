import { Component, Input } from '@angular/core';
import { AnimationShowWorkComponent } from '../../animation/animation-show-work/animation-show-work.component';
import { AudioOscillatorShowWorkComponent } from '../../audioOscillator/audio-oscillator-show-work/audio-oscillator-show-work.component';
import { ConceptMapShowWorkComponent } from '../../conceptMap/concept-map-show-work/concept-map-show-work.component';
import { DialogGuidanceShowWorkComponent } from '../../dialogGuidance/dialog-guidance-show-work/dialog-guidance-show-work.component';
import { DiscussionStudent } from '../../discussion/discussion-student/discussion-student.component';
import { DrawShowWorkComponent } from '../../draw/draw-show-work/draw-show-work.component';
import { EmbeddedShowWorkComponent } from '../../embedded/embedded-show-work/embedded-show-work.component';
import { GraphShowWorkComponent } from '../../graph/graph-show-work/graph-show-work.component';
import { LabelShowWorkComponent } from '../../label/label-show-work/label-show-work.component';
import { MatchShowWorkComponent } from '../../match/match-show-work/match-show-work.component';
import { MultipleChoiceShowWorkComponent } from '../../multipleChoice/multiple-choice-show-work/multiple-choice-show-work.component';
import { OpenResponseShowWorkComponent } from '../../openResponse/open-response-show-work/open-response-show-work.component';
import { PeerChatStudentComponent } from '../../peerChat/peer-chat-student/peer-chat-student.component';
import { TableShowWorkComponent } from '../../table/table-show-work/table-show-work.component';

@Component({
  imports: [
    AnimationShowWorkComponent,
    AudioOscillatorShowWorkComponent,
    ConceptMapShowWorkComponent,
    DialogGuidanceShowWorkComponent,
    DiscussionStudent,
    DrawShowWorkComponent,
    EmbeddedShowWorkComponent,
    GraphShowWorkComponent,
    LabelShowWorkComponent,
    MatchShowWorkComponent,
    MultipleChoiceShowWorkComponent,
    OpenResponseShowWorkComponent,
    PeerChatStudentComponent,
    TableShowWorkComponent
  ],
  selector: 'show-work-student',
  templateUrl: './show-work-student.component.html'
})
export class ShowWorkStudentComponent {
  @Input() componentContent: any;
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() studentWork: any;
}
