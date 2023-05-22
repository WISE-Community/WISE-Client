import { AnimationAuthoring } from './animation/animation-authoring/animation-authoring.component';
import { AnimationStudent } from './animation/animation-student/animation-student.component';
import { AudioOscillatorAuthoring } from './audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { AudioOscillatorStudent } from './audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { ConceptMapAuthoring } from './conceptMap/concept-map-authoring/concept-map-authoring.component';
import { ConceptMapStudent } from './conceptMap/concept-map-student/concept-map-student.component';
import { DialogGuidanceAuthoringComponent } from './dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DialogGuidanceStudentComponent } from './dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { DiscussionAuthoring } from './discussion/discussion-authoring/discussion-authoring.component';
import { DiscussionStudent } from './discussion/discussion-student/discussion-student.component';
import { DrawAuthoring } from './draw/draw-authoring/draw-authoring.component';
import { DrawStudent } from './draw/draw-student/draw-student.component';
import { EmbeddedAuthoring } from './embedded/embedded-authoring/embedded-authoring.component';
import { EmbeddedStudent } from './embedded/embedded-student/embedded-student.component';
import { GraphAuthoring } from './graph/graph-authoring/graph-authoring.component';
import { GraphStudent } from './graph/graph-student/graph-student.component';
import { HtmlAuthoring } from './html/html-authoring/html-authoring.component';
import { HtmlStudent } from './html/html-student/html-student.component';
import { LabelAuthoring } from './label/label-authoring/label-authoring.component';
import { LabelStudent } from './label/label-student/label-student.component';
import { MatchAuthoring } from './match/match-authoring/match-authoring.component';
import { MatchStudent } from './match/match-student/match-student.component';
import { MultipleChoiceAuthoring } from './multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { MultipleChoiceStudent } from './multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { OpenResponseAuthoring } from './openResponse/open-response-authoring/open-response-authoring.component';
import { OpenResponseStudent } from './openResponse/open-response-student/open-response-student.component';
import { OutsideUrlAuthoring } from './outsideURL/outside-url-authoring/outside-url-authoring.component';
import { OutsideUrlStudent } from './outsideURL/outside-url-student/outside-url-student.component';
import { PeerChatAuthoringComponent } from './peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { PeerChatStudentComponent } from './peerChat/peer-chat-student/peer-chat-student.component';
import { ShowGroupWorkAuthoringComponent } from './showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { ShowGroupWorkStudentComponent } from './showGroupWork/show-group-work-student/show-group-work-student.component';
import { ShowMyWorkAuthoringComponent } from './showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { ShowMyWorkStudentComponent } from './showMyWork/show-my-work-student/show-my-work-student.component';
import { SummaryAuthoring } from './summary/summary-authoring/summary-authoring.component';
import { SummaryStudent } from './summary/summary-student/summary-student.component';
import { TableAuthoring } from './table/table-authoring/table-authoring.component';
import { TableStudent } from './table/table-student/table-student.component';

export const components = {
  Animation: {
    authoring: AnimationAuthoring,
    student: AnimationStudent
  },
  AudioOscillator: { authoring: AudioOscillatorAuthoring, student: AudioOscillatorStudent },
  ConceptMap: { authoring: ConceptMapAuthoring, student: ConceptMapStudent },
  DialogGuidance: {
    authoring: DialogGuidanceAuthoringComponent,
    student: DialogGuidanceStudentComponent
  },
  Discussion: { authoring: DiscussionAuthoring, student: DiscussionStudent },
  Draw: { authoring: DrawAuthoring, student: DrawStudent },
  Embedded: { authoring: EmbeddedAuthoring, student: EmbeddedStudent },
  Graph: { authoring: GraphAuthoring, student: GraphStudent },
  HTML: { authoring: HtmlAuthoring, student: HtmlStudent },
  Label: { authoring: LabelAuthoring, student: LabelStudent },
  Match: { authoring: MatchAuthoring, student: MatchStudent },
  MultipleChoice: { authoring: MultipleChoiceAuthoring, student: MultipleChoiceStudent },
  OpenResponse: { authoring: OpenResponseAuthoring, student: OpenResponseStudent },
  OutsideURL: { authoring: OutsideUrlAuthoring, student: OutsideUrlStudent },
  PeerChat: { authoring: PeerChatAuthoringComponent, student: PeerChatStudentComponent },
  ShowGroupWork: {
    authoring: ShowGroupWorkAuthoringComponent,
    student: ShowGroupWorkStudentComponent
  },
  ShowMyWork: { authoring: ShowMyWorkAuthoringComponent, student: ShowMyWorkStudentComponent },
  Summary: { authoring: SummaryAuthoring, student: SummaryStudent },
  Table: { authoring: TableAuthoring, student: TableStudent }
};
