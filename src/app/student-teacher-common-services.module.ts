import { AchievementService } from '../assets/wise5/services/achievementService';
import { AiChatService } from '../assets/wise5/components/aiChat/aiChatService';
import { AnimationService } from '../assets/wise5/components/animation/animationService';
import { AnnotationService } from '../assets/wise5/services/annotationService';
import { AudioOscillatorService } from '../assets/wise5/components/audioOscillator/audioOscillatorService';
import { AudioRecorderService } from '../assets/wise5/services/audioRecorderService';
import { BranchService } from '../assets/wise5/services/branchService';
import { ClassroomStatusService } from '../assets/wise5/services/classroomStatusService';
import { ClickToSnipImageService } from '../assets/wise5/services/clickToSnipImageService';
import { CompletionService } from '../assets/wise5/services/completionService';
import { ComponentService } from '../assets/wise5/components/componentService';
import { ComponentServiceLookupService } from '../assets/wise5/services/componentServiceLookupService';
import { ComponentTypeService } from '../assets/wise5/services/componentTypeService';
import { ComputerAvatarService } from '../assets/wise5/services/computerAvatarService';
import { ConceptMapService } from '../assets/wise5/components/conceptMap/conceptMapService';
import { ConfigService } from '../assets/wise5/services/configService';
import { ConstraintService } from '../assets/wise5/services/constraintService';
import { CRaterService } from '../assets/wise5/services/cRaterService';
import { DialogGuidanceService } from '../assets/wise5/components/dialogGuidance/dialogGuidanceService';
import { DiscussionService } from '../assets/wise5/components/discussion/discussionService';
import { DrawService } from '../assets/wise5/components/draw/drawService';
import { EmbeddedService } from '../assets/wise5/components/embedded/embeddedService';
import { GraphService } from '../assets/wise5/components/graph/graphService';
import { HTMLService } from '../assets/wise5/components/html/htmlService';
import { LabelService } from '../assets/wise5/components/label/labelService';
import { MatchService } from '../assets/wise5/components/match/matchService';
import { MultipleChoiceService } from '../assets/wise5/components/multipleChoice/multipleChoiceService';
import { NgModule } from '@angular/core';
import { NodeProgressService } from '../assets/wise5/services/nodeProgressService';
import { NodeService } from '../assets/wise5/services/nodeService';
import { NodeStatusService } from '../assets/wise5/services/nodeStatusService';
import { NotebookService } from '../assets/wise5/services/notebookService';
import { NotificationService } from '../assets/wise5/services/notificationService';
import { OpenResponseCompletionCriteriaService } from '../assets/wise5/components/openResponse/openResponseCompletionCriteriaService';
import { OpenResponseService } from '../assets/wise5/components/openResponse/openResponseService';
import { OutsideURLService } from '../assets/wise5/components/outsideURL/outsideURLService';
import { PathService } from '../assets/wise5/services/pathService';
import { PeerChatService } from '../assets/wise5/components/peerChat/peerChatService';
import { PeerGroupService } from '../assets/wise5/services/peerGroupService';
import { ProjectLibraryService } from '../assets/wise5/services/projectLibraryService';
import { ProjectService } from '../assets/wise5/services/projectService';
import { SessionService } from '../assets/wise5/services/sessionService';
import { ShowGroupWorkService } from '../assets/wise5/components/showGroupWork/showGroupWorkService';
import { ShowMyWorkService } from '../assets/wise5/components/showMyWork/showMyWorkService';
import { StompService } from '../assets/wise5/services/stompService';
import { StudentAssetService } from '../assets/wise5/services/studentAssetService';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { StudentNodeService } from '../assets/wise5/services/studentNodeService';
import { StudentPeerGroupService } from '../assets/wise5/services/studentPeerGroupService';
import { StudentProjectTranslationService } from '../assets/wise5/services/studentProjectTranslationService';
import { StudentStatusService } from '../assets/wise5/services/studentStatusService';
import { StudentWebSocketService } from '../assets/wise5/services/studentWebSocketService';
import { SummaryService } from '../assets/wise5/components/summary/summaryService';
import { TableService } from '../assets/wise5/components/table/tableService';
import { TabulatorDataService } from '../assets/wise5/components/table/tabulatorDataService';
import { TagService } from '../assets/wise5/services/tagService';
import { TeacherDataService } from '../assets/wise5/services/teacherDataService';
import { TeacherNodeService } from '../assets/wise5/services/teacherNodeService';
import { TeacherWebSocketService } from '../assets/wise5/services/teacherWebSocketService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { WiseLinkService } from './services/wiseLinkService';

@NgModule({
  providers: [
    AchievementService,
    AiChatService,
    AnimationService,
    AnnotationService,
    AudioOscillatorService,
    AudioRecorderService,
    BranchService,
    ClassroomStatusService,
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
    TeacherDataService,
    TeacherNodeService,
    TeacherWebSocketService,
    StudentProjectTranslationService,
    VLEProjectService,
    WiseLinkService
  ]
})
export class StudentTeacherCommonServicesModule {}
