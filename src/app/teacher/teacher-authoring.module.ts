import { NgModule } from '@angular/core';

import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { ProjectAssetService } from '../services/projectAssetService';
import { SpaceService } from '../../assets/wise5/services/spaceService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { DataService } from '../services/data.service';
import { MilestoneService } from '../../assets/wise5/services/milestoneService';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
import { CopyProjectService } from '../../assets/wise5/services/copyProjectService';
import { DeleteNodeService } from '../../assets/wise5/services/deleteNodeService';
import { ImportComponentService } from '../../assets/wise5/services/importComponentService';
import { InsertComponentService } from '../../assets/wise5/services/insertComponentService';
import { InsertNodesService } from '../../assets/wise5/services/insertNodesService';
import { MoveNodesService } from '../../assets/wise5/services/moveNodesService';
import { AuthoringToolModule } from '../teacher/authoring-tool.module';
import { UpdateWorkgroupService } from '../services/updateWorkgroupService';
import { GetWorkgroupService } from '../services/getWorkgroupService';
import { WorkgroupService } from '../services/workgroup.service';
import { TeacherWorkService } from '../../assets/wise5/services/teacherWorkService';
import { TeacherDiscussionService } from '../../assets/wise5/components/discussion/teacherDiscussionService';
import { TeacherPeerGroupService } from '../../assets/wise5/services/teacherPeerGroupService';
import { DataExportService } from '../../assets/wise5/services/dataExportService';
import { PeerGroupService } from '../../assets/wise5/services/peerGroupService';
import { NodeService } from '../../assets/wise5/services/nodeService';
import { TeacherNodeService } from '../../assets/wise5/services/teacherNodeService';
import { MilestoneReportService } from '../../assets/wise5/services/milestoneReportService';
import { AuthoringRoutingModule } from './authoring-routing.module';
import { RouterModule } from '@angular/router';
import { ComponentInfoService } from '../../assets/wise5/services/componentInfoService';
import { TeacherProjectTranslationService } from '../../assets/wise5/services/teacherProjectTranslationService';
import { DeleteTranslationsService } from '../../assets/wise5/services/deleteTranslationsService';
import { CopyTranslationsService } from '../../assets/wise5/services/copyTranslationsService';
import { CreateComponentService } from '../../assets/wise5/services/createComponentService';
import { NotifyAuthorService } from '../../assets/wise5/services/notifyAuthorService';
import { RemoveNodeIdFromTransitionsService } from '../../assets/wise5/services/removeNodeIdFromTransitionsService';

@NgModule({
  imports: [StudentTeacherCommonModule, AuthoringToolModule, RouterModule, AuthoringRoutingModule],
  providers: [
    ClassroomStatusService,
    ComponentInfoService,
    CopyNodesService,
    CopyProjectService,
    CopyTranslationsService,
    CreateComponentService,
    DataExportService,
    { provide: DataService, useExisting: TeacherDataService },
    TeacherProjectTranslationService,
    GetWorkgroupService,
    DeleteNodeService,
    ImportComponentService,
    InsertComponentService,
    InsertNodesService,
    MilestoneService,
    MilestoneReportService,
    MoveNodesService,
    { provide: NodeService, useExisting: TeacherNodeService },
    NotifyAuthorService,
    ProjectAssetService,
    SpaceService,
    DeleteTranslationsService,
    { provide: PeerGroupService, useExisting: TeacherPeerGroupService },
    { provide: ProjectService, useExisting: TeacherProjectService },
    RemoveNodeIdFromTransitionsService,
    TeacherDataService,
    TeacherDiscussionService,
    TeacherNodeService,
    TeacherPeerGroupService,
    TeacherProjectService,
    TeacherWebSocketService,
    TeacherWorkService,
    UpdateWorkgroupService,
    WorkgroupService
  ]
})
export class TeacherAuthoringModule {}
