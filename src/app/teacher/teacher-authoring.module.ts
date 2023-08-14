import { NgModule } from '@angular/core';

import '../../assets/wise5/teacher/teacher-angular-js-module';
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
import { TeacherAuthoringRoutingModule } from '../teacher/teacher-authoring-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    StudentTeacherCommonModule,
    AuthoringToolModule,
    RouterModule,
    TeacherAuthoringRoutingModule
  ],
  providers: [
    ClassroomStatusService,
    CopyNodesService,
    CopyProjectService,
    DataExportService,
    { provide: DataService, useExisting: TeacherDataService },
    GetWorkgroupService,
    DeleteNodeService,
    ImportComponentService,
    InsertComponentService,
    InsertNodesService,
    MilestoneService,
    MilestoneReportService,
    MoveNodesService,
    { provide: NodeService, useExisting: TeacherNodeService },
    ProjectAssetService,
    SpaceService,
    { provide: PeerGroupService, useExisting: TeacherPeerGroupService },
    { provide: ProjectService, useExisting: TeacherProjectService },
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
