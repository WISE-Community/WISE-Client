import { NgModule } from '@angular/core';
import { AnimationAuthoring } from '../../assets/wise5/components/animation/animation-authoring/animation-authoring.component';
import { AudioOscillatorAuthoring } from '../../assets/wise5/components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from '../../assets/wise5/components/conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DialogGuidanceAuthoringComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DiscussionAuthoring } from '../../assets/wise5/components/discussion/discussion-authoring/discussion-authoring.component';
import { DrawAuthoring } from '../../assets/wise5/components/draw/draw-authoring/draw-authoring.component';
import { EmbeddedAuthoring } from '../../assets/wise5/components/embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from '../../assets/wise5/components/graph/graph-authoring/graph-authoring.component';
import { HtmlAuthoringComponent } from '../../assets/wise5/components/html/html-authoring/html-authoring.component';
import { LabelAuthoring } from '../../assets/wise5/components/label/label-authoring/label-authoring.component';
import { MatchAuthoringComponent } from '../../assets/wise5/components/match/match-authoring/match-authoring.component';
import { MultipleChoiceAuthoring } from '../../assets/wise5/components/multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { OpenResponseAuthoringComponent } from '../../assets/wise5/components/openResponse/open-response-authoring/open-response-authoring.component';
import { OutsideUrlAuthoring } from '../../assets/wise5/components/outsideURL/outside-url-authoring/outside-url-authoring.component';
import { SummaryAuthoring } from '../../assets/wise5/components/summary/summary-authoring/summary-authoring.component';
import { TableAuthoring } from '../../assets/wise5/components/table/table-authoring/table-authoring.component';
import { PeerChatAuthoringComponent } from '../../assets/wise5/components/peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { ShowMyWorkAuthoringComponent } from '../../assets/wise5/components/showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { ShowGroupWorkAuthoringComponent } from '../../assets/wise5/components/showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { EditComponentAdvancedComponent } from '../authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { AiChatAuthoringComponent } from '../../assets/wise5/components/aiChat/ai-chat-authoring/ai-chat-authoring.component';
import { PeerGroupingAuthoringService } from '../../assets/wise5/services/peerGroupingAuthoringService';

@NgModule({
  imports: [
    AiChatAuthoringComponent,
    AnimationAuthoring,
    AudioOscillatorAuthoring,
    ConceptMapAuthoring,
    DiscussionAuthoring,
    DrawAuthoring,
    DialogGuidanceAuthoringComponent,
    EditComponentAdvancedComponent,
    EmbeddedAuthoring,
    GraphAuthoring,
    LabelAuthoring,
    OutsideUrlAuthoring,
    PeerChatAuthoringComponent,
    ShowGroupWorkAuthoringComponent,
    ShowMyWorkAuthoringComponent,
    SummaryAuthoring,
    TableAuthoring,
    HtmlAuthoringComponent,
    MatchAuthoringComponent,
    MultipleChoiceAuthoring,
    OpenResponseAuthoringComponent,
    StudentTeacherCommonModule
  ],
  providers: [PeerGroupingAuthoringService]
})
export class ComponentAuthoringModule {}
