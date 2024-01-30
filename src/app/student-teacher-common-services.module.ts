import { NgModule } from '@angular/core';
import { ConfigService } from '../assets/wise5/services/configService';
import { ProjectService } from '../assets/wise5/services/projectService';
import { ProjectLibraryService } from '../assets/wise5/services/projectLibraryService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { CRaterService } from '../assets/wise5/services/cRaterService';
import { SessionService } from '../assets/wise5/services/sessionService';
import { StudentAssetService } from '../assets/wise5/services/studentAssetService';
import { TagService } from '../assets/wise5/services/tagService';
import { AudioRecorderService } from '../assets/wise5/services/audioRecorderService';
import { AnnotationService } from '../assets/wise5/services/annotationService';
import { StudentWebSocketService } from '../assets/wise5/services/studentWebSocketService';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { AchievementService } from '../assets/wise5/services/achievementService';
import { SummaryService } from '../assets/wise5/components/summary/summaryService';
import { TableService } from '../assets/wise5/components/table/tableService';
import { NotebookService } from '../assets/wise5/services/notebookService';
import { NotificationService } from '../assets/wise5/services/notificationService';
import { OutsideURLService } from '../assets/wise5/components/outsideURL/outsideURLService';
import { MatchService } from '../assets/wise5/components/match/matchService';
import { MultipleChoiceService } from '../assets/wise5/components/multipleChoice/multipleChoiceService';
import { OpenResponseService } from '../assets/wise5/components/openResponse/openResponseService';
import { NodeService } from '../assets/wise5/services/nodeService';
import { DiscussionService } from '../assets/wise5/components/discussion/discussionService';
import { DrawService } from '../assets/wise5/components/draw/drawService';
import { EmbeddedService } from '../assets/wise5/components/embedded/embeddedService';
import { HTMLService } from '../assets/wise5/components/html/htmlService';
import { LabelService } from '../assets/wise5/components/label/labelService';
import { AnimationService } from '../assets/wise5/components/animation/animationService';
import { AudioOscillatorService } from '../assets/wise5/components/audioOscillator/audioOscillatorService';
import { ConceptMapService } from '../assets/wise5/components/conceptMap/conceptMapService';
import { GraphService } from '../assets/wise5/components/graph/graphService';
import { ComponentService } from '../assets/wise5/components/componentService';
import { WiseLinkService } from './services/wiseLinkService';
import { DialogGuidanceService } from '../assets/wise5/components/dialogGuidance/dialogGuidanceService';
import { PeerChatService } from '../assets/wise5/components/peerChat/peerChatService';
import { ShowMyWorkService } from '../assets/wise5/components/showMyWork/showMyWorkService';
import { ShowGroupWorkService } from '../assets/wise5/components/showGroupWork/showGroupWorkService';
import { ComputerAvatarService } from '../assets/wise5/services/computerAvatarService';
import { StudentStatusService } from '../assets/wise5/services/studentStatusService';
import { OpenResponseCompletionCriteriaService } from '../assets/wise5/components/openResponse/openResponseCompletionCriteriaService';
import { ComponentServiceLookupService } from '../assets/wise5/services/componentServiceLookupService';
import { ComponentTypeService } from '../assets/wise5/services/componentTypeService';
import { BranchService } from '../assets/wise5/services/branchService';
import { PathService } from '../assets/wise5/services/pathService';
import { TabulatorDataService } from '../assets/wise5/components/table/tabulatorDataService';
import { StompService } from '../assets/wise5/services/stompService';
import { ClickToSnipImageService } from '../assets/wise5/services/clickToSnipImageService';
import { StudentPeerGroupService } from '../assets/wise5/services/studentPeerGroupService';
import { ConstraintService } from '../assets/wise5/services/constraintService';
import { NodeStatusService } from '../assets/wise5/services/nodeStatusService';
import { PeerGroupService } from '../assets/wise5/services/peerGroupService';
import { NodeProgressService } from '../assets/wise5/services/nodeProgressService';
import { CompletionService } from '../assets/wise5/services/completionService';
import { StudentNodeService } from '../assets/wise5/services/studentNodeService';
import { AiChatService } from '../assets/wise5/components/aiChat/aiChatService';

@NgModule({
  providers: [
    AchievementService,
    AiChatService,
    AnimationService,
    AnnotationService,
    AudioOscillatorService,
    AudioRecorderService,
    BranchService,
    ClickToSnipImageService,
    ConceptMapService,
    ConstraintService,
    CompletionService,
    ComponentService,
    ComponentServiceLookupService,
    ComponentTypeService,
    ComputerAvatarService,
    ConfigService,
    CRaterService,
    DialogGuidanceService,
    DiscussionService,
    DrawService,
    EmbeddedService,
    GraphService,
    HTMLService,
    LabelService,
    MatchService,
    MultipleChoiceService,
    NodeProgressService,
    { provide: NodeService, useExisting: StudentNodeService },
    NodeStatusService,
    NotebookService,
    NotificationService,
    OutsideURLService,
    OpenResponseCompletionCriteriaService,
    OpenResponseService,
    PathService,
    PeerChatService,
    PeerGroupService,
    ProjectLibraryService,
    { provide: ProjectService, useExisting: VLEProjectService },
    SessionService,
    ShowGroupWorkService,
    ShowMyWorkService,
    StompService,
    StudentAssetService,
    StudentDataService,
    StudentNodeService,
    StudentPeerGroupService,
    StudentStatusService,
    StudentWebSocketService,
    SummaryService,
    TableService,
    TabulatorDataService,
    TagService,
    VLEProjectService,
    WiseLinkService
  ]
})
export class StudentTeacherCommonServicesModule {}
