import { NgModule } from '@angular/core';
import { AnimationService } from '../components/animation/animationService';
import { AudioOscillatorService } from '../components/audioOscillator/audioOscillatorService';
import { ConceptMapService } from '../components/conceptMap/conceptMapService';
import { DialogGuidanceService } from '../components/dialogGuidance/dialogGuidanceService';
import { DiscussionService } from '../components/discussion/discussionService';
import { DrawService } from '../components/draw/drawService';
import { EmbeddedService } from '../components/embedded/embeddedService';
import { GraphService } from '../components/graph/graphService';
import { HTMLService } from '../components/html/htmlService';
import { LabelService } from '../components/label/labelService';
import { MatchService } from '../components/match/matchService';
import { MultipleChoiceService } from '../components/multipleChoice/multipleChoiceService';
import { OpenResponseCompletionCriteriaService } from '../components/openResponse/openResponseCompletionCriteriaService';
import { OpenResponseService } from '../components/openResponse/openResponseService';
import { OutsideURLService } from '../components/outsideURL/outsideURLService';
import { PeerChatService } from '../components/peerChat/peerChatService';
import { ShowGroupWorkService } from '../components/showGroupWork/showGroupWorkService';
import { ShowMyWorkService } from '../components/showMyWork/showMyWorkService';
import { SummaryService } from '../components/summary/summaryService';
import { TableService } from '../components/table/tableService';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { ComputerAvatarService } from './computerAvatarService';
import { ConfigService } from './configService';
import { StudentAssetService } from './studentAssetService';
import { AiChatService } from '../components/aiChat/aiChatService';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    AiChatService,
    AnimationService,
    AudioOscillatorService,
    ComputerAvatarService,
    ComponentServiceLookupService,
    ConceptMapService,
    ConfigService,
    DialogGuidanceService,
    DiscussionService,
    DrawService,
    EmbeddedService,
    GraphService,
    LabelService,
    MatchService,
    MultipleChoiceService,
    OpenResponseCompletionCriteriaService,
    OpenResponseService,
    OutsideURLService,
    PeerChatService,
    HTMLService,
    ShowGroupWorkService,
    ShowMyWorkService,
    StudentAssetService,
    SummaryService,
    TableService
  ]
})
export class ComponentServiceLookupServiceModule {}
