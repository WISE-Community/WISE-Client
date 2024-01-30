import { AiChatStudentComponent } from './aiChat/ai-chat-student/ai-chat-student.component';
import { AnimationAuthoring } from './animation/animation-authoring/animation-authoring.component';
import { AnimationGradingComponent } from './animation/animation-grading/animation-grading.component';
import { AnimationStudent } from './animation/animation-student/animation-student.component';
import { AudioOscillatorAuthoring } from './audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { AudioOscillatorGradingComponent } from './audioOscillator/audio-oscillator-grading/audio-oscillator-grading.component';
import { AudioOscillatorStudent } from './audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { ConceptMapAuthoring } from './conceptMap/concept-map-authoring/concept-map-authoring.component';
import { ConceptMapGradingComponent } from './conceptMap/concept-map-grading/concept-map-grading.component';
import { ConceptMapStudent } from './conceptMap/concept-map-student/concept-map-student.component';
import { DialogGuidanceAuthoringComponent } from './dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DialogGuidanceGradingComponent } from './dialogGuidance/dialog-guidance-grading/dialog-guidance-grading.component';
import { DialogGuidanceStudentComponent } from './dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { DiscussionAuthoring } from './discussion/discussion-authoring/discussion-authoring.component';
import { DiscussionGradingComponent } from './discussion/discussion-grading/discussion-grading.component';
import { DiscussionStudent } from './discussion/discussion-student/discussion-student.component';
import { DrawAuthoring } from './draw/draw-authoring/draw-authoring.component';
import { DrawGradingComponent } from './draw/draw-grading/draw-grading.component';
import { DrawStudent } from './draw/draw-student/draw-student.component';
import { EmbeddedAuthoring } from './embedded/embedded-authoring/embedded-authoring.component';
import { EmbeddedGradingComponent } from './embedded/embedded-grading/embedded-grading.component';
import { EmbeddedStudent } from './embedded/embedded-student/embedded-student.component';
import { GraphAuthoring } from './graph/graph-authoring/graph-authoring.component';
import { GraphGradingComponent } from './graph/graph-grading/graph-grading.component';
import { GraphStudent } from './graph/graph-student/graph-student.component';
import { HtmlAuthoring } from './html/html-authoring/html-authoring.component';
import { HtmlStudent } from './html/html-student/html-student.component';
import { LabelAuthoring } from './label/label-authoring/label-authoring.component';
import { LabelGradingComponent } from './label/label-grading/label-grading.component';
import { LabelStudent } from './label/label-student/label-student.component';
import { MatchAuthoring } from './match/match-authoring/match-authoring.component';
import { MatchGradingComponent } from './match/match-grading/match-grading.component';
import { MatchStudent } from './match/match-student/match-student.component';
import { MultipleChoiceAuthoring } from './multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { MultipleChoiceGradingComponent } from './multipleChoice/multiple-choice-grading/multiple-choice-grading.component';
import { MultipleChoiceStudent } from './multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { OpenResponseAuthoring } from './openResponse/open-response-authoring/open-response-authoring.component';
import { OpenResponseGradingComponent } from './openResponse/open-response-grading/open-response-grading.component';
import { OpenResponseStudent } from './openResponse/open-response-student/open-response-student.component';
import { OutsideUrlAuthoring } from './outsideURL/outside-url-authoring/outside-url-authoring.component';
import { OutsideUrlStudent } from './outsideURL/outside-url-student/outside-url-student.component';
import { PeerChatAuthoringComponent } from './peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { PeerChatGradingComponent } from './peerChat/peer-chat-grading/peer-chat-grading.component';
import { PeerChatStudentComponent } from './peerChat/peer-chat-student/peer-chat-student.component';
import { ShowGroupWorkAuthoringComponent } from './showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { ShowGroupWorkGradingComponent } from './showGroupWork/show-group-work-grading/show-group-work-grading.component';
import { ShowGroupWorkStudentComponent } from './showGroupWork/show-group-work-student/show-group-work-student.component';
import { ShowMyWorkAuthoringComponent } from './showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { ShowMyWorkGradingComponent } from './showMyWork/show-my-work-grading/show-my-work-grading.component';
import { ShowMyWorkStudentComponent } from './showMyWork/show-my-work-student/show-my-work-student.component';
import { SummaryAuthoring } from './summary/summary-authoring/summary-authoring.component';
import { SummaryStudent } from './summary/summary-student/summary-student.component';
import { TableAuthoring } from './table/table-authoring/table-authoring.component';
import { TableGradingComponent } from './table/table-grading/table-grading.component';
import { TableStudent } from './table/table-student/table-student.component';

export const components = {
  AiChat: {
    student: AiChatStudentComponent
  },
  Animation: {
    authoring: AnimationAuthoring,
    grading: AnimationGradingComponent,
    student: AnimationStudent
  },
  AudioOscillator: {
    authoring: AudioOscillatorAuthoring,
    grading: AudioOscillatorGradingComponent,
    student: AudioOscillatorStudent
  },
  ConceptMap: {
    authoring: ConceptMapAuthoring,
    grading: ConceptMapGradingComponent,
    student: ConceptMapStudent
  },
  DialogGuidance: {
    authoring: DialogGuidanceAuthoringComponent,
    grading: DialogGuidanceGradingComponent,
    student: DialogGuidanceStudentComponent
  },
  Discussion: {
    authoring: DiscussionAuthoring,
    grading: DiscussionGradingComponent,
    student: DiscussionStudent
  },
  Draw: { authoring: DrawAuthoring, grading: DrawGradingComponent, student: DrawStudent },
  Embedded: {
    authoring: EmbeddedAuthoring,
    grading: EmbeddedGradingComponent,
    student: EmbeddedStudent
  },
  Graph: { authoring: GraphAuthoring, grading: GraphGradingComponent, student: GraphStudent },
  HTML: { authoring: HtmlAuthoring, student: HtmlStudent },
  Label: { authoring: LabelAuthoring, grading: LabelGradingComponent, student: LabelStudent },
  Match: { authoring: MatchAuthoring, grading: MatchGradingComponent, student: MatchStudent },
  MultipleChoice: {
    authoring: MultipleChoiceAuthoring,
    grading: MultipleChoiceGradingComponent,
    student: MultipleChoiceStudent
  },
  OpenResponse: {
    authoring: OpenResponseAuthoring,
    grading: OpenResponseGradingComponent,
    student: OpenResponseStudent
  },
  OutsideURL: { authoring: OutsideUrlAuthoring, student: OutsideUrlStudent },
  PeerChat: {
    authoring: PeerChatAuthoringComponent,
    grading: PeerChatGradingComponent,
    student: PeerChatStudentComponent
  },
  ShowGroupWork: {
    authoring: ShowGroupWorkAuthoringComponent,
    grading: ShowGroupWorkGradingComponent,
    student: ShowGroupWorkStudentComponent
  },
  ShowMyWork: {
    authoring: ShowMyWorkAuthoringComponent,
    grading: ShowMyWorkGradingComponent,
    student: ShowMyWorkStudentComponent
  },
  Summary: { authoring: SummaryAuthoring, student: SummaryStudent },
  Table: { authoring: TableAuthoring, grading: TableGradingComponent, student: TableStudent }
};
