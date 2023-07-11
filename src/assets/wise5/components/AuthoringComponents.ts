import { AnimationAuthoring } from './animation/animation-authoring/animation-authoring.component';
import { AudioOscillatorAuthoring } from './audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from './conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DialogGuidanceAuthoringComponent } from './dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DiscussionAuthoring } from './discussion/discussion-authoring/discussion-authoring.component';
import { DrawAuthoring } from './draw/draw-authoring/draw-authoring.component';
import { EmbeddedAuthoring } from './embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from './graph/graph-authoring/graph-authoring.component';
import { HtmlAuthoring } from './html/html-authoring/html-authoring.component';
import { LabelAuthoring } from './label/label-authoring/label-authoring.component';
import { MatchAuthoring } from './match/match-authoring/match-authoring.component';
import { MultipleChoiceAuthoring } from './multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { OpenResponseAuthoring } from './openResponse/open-response-authoring/open-response-authoring.component';
import { OutsideUrlAuthoring } from './outsideURL/outside-url-authoring/outside-url-authoring.component';
import { PeerChatAuthoringComponent } from './peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { ShowGroupWorkAuthoringComponent } from './showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { ShowMyWorkAuthoringComponent } from './showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { SummaryAuthoring } from './summary/summary-authoring/summary-authoring.component';
import { TableAuthoring } from './table/table-authoring/table-authoring.component';

export const authoringComponents = {
  Animation: AnimationAuthoring,
  AudioOscillator: AudioOscillatorAuthoring,
  ConceptMap: ConceptMapAuthoring,
  DialogGuidance: DialogGuidanceAuthoringComponent,
  Discussion: DiscussionAuthoring,
  Draw: DrawAuthoring,
  Embedded: EmbeddedAuthoring,
  Graph: GraphAuthoring,
  HTML: HtmlAuthoring,
  Label: LabelAuthoring,
  Match: MatchAuthoring,
  MultipleChoice: MultipleChoiceAuthoring,
  OpenResponse: OpenResponseAuthoring,
  OutsideURL: OutsideUrlAuthoring,
  PeerChat: PeerChatAuthoringComponent,
  ShowGroupWork: ShowGroupWorkAuthoringComponent,
  ShowMyWork: ShowMyWorkAuthoringComponent,
  Summary: SummaryAuthoring,
  Table: TableAuthoring
};
