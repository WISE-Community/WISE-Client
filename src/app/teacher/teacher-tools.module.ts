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
import { ClassroomMonitorModule } from '../teacher/classroom-monitor.module';
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
import { RouterModule } from '@angular/router';
import { TeacherToolsRoutingModule } from './teacher-tools-routing.module';
import { TeacherPauseScreenService } from '../../assets/wise5/services/teacherPauseScreenService';

@NgModule({
  imports: [
    StudentTeacherCommonModule,
    ClassroomMonitorModule,
    RouterModule,
    TeacherToolsRoutingModule
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
    TeacherPauseScreenService,
    TeacherPeerGroupService,
    TeacherProjectService,
    TeacherWebSocketService,
    TeacherWorkService,
    UpdateWorkgroupService,
    WorkgroupService
  ]
})
export class TeacherToolsModule {}
