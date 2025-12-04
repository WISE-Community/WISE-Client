import { NgModule } from '@angular/core';
import { ClassroomStatusService } from '../services/classroomStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MilestoneService } from '../services/milestoneService';
import { TeacherPeerGroupService } from '../services/teacherPeerGroupService';
import { MilestoneReportService } from '../services/milestoneReportService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TeacherPauseScreenService } from '../services/teacherPauseScreenService';
import { RunStatusService } from '../services/runStatusService';
import { GradingNodeService } from '../services/gradingNodeService';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { AnnotationService } from '../services/annotationService';
import { BranchService } from '../services/branchService';
import { ProjectService } from '../services/projectService';
import { PathService } from '../services/pathService';
import { ComponentServiceLookupService } from '../services/componentServiceLookupService';
import { MockProvider } from 'ng-mocks';
import { AchievementService } from '../services/achievementService';
import { StudentAssetService } from '../services/studentAssetService';
import { NodeService } from '../services/nodeService';
import { SessionService } from '../services/sessionService';
import { StudentNodeService } from '../services/studentNodeService';
import { ConstraintService } from '../services/constraintService';
import { StudentDataService } from '../services/studentDataService';
import { NodeStatusService } from '../services/nodeStatusService';

@NgModule({
  providers: [
    AnnotationService,
    MockProvider(AchievementService),
    BranchService,
    MockProvider(ComponentServiceLookupService),
    ConfigService,
    MockProvider(ConstraintService),
    ClassroomStatusService,
    GradingNodeService,
    MilestoneService,
    MilestoneReportService,
    { provide: NodeService, useClass: StudentNodeService },
    NodeStatusService,
    NotebookService,
    NotificationService,
    PathService,
    ProjectService,
    SessionService,
    StudentAssetService,
    StudentDataService,
    StudentNodeService,
    TeacherDataService,
    TeacherPauseScreenService,
    TeacherPeerGroupService,
    TeacherProjectService,
    TeacherWebSocketService,
    RunStatusService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting()
  ]
})
export class ClassroomMonitorTestingModule {}
