import { Component, NgModule } from '@angular/core';

import '../assets/wise5/teacher/teacher-angular-js-module';
import { StudentTeacherCommonModule } from './student-teacher-common.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from '../assets/wise5/services/projectService';
import { TeacherProjectService } from '../assets/wise5/services/teacherProjectService';
import { ProjectAssetService } from './services/projectAssetService';
import { SpaceService } from '../assets/wise5/services/spaceService';
import { ClassroomStatusService } from '../assets/wise5/services/classroomStatusService';
import { TeacherDataService } from '../assets/wise5/services/teacherDataService';
import { TeacherWebSocketService } from '../assets/wise5/services/teacherWebSocketService';
import { DataService } from './services/data.service';
import { MilestoneService } from '../assets/wise5/services/milestoneService';
import { CopyComponentService } from '../assets/wise5/services/copyComponentService';
import { CopyNodesService } from '../assets/wise5/services/copyNodesService';
import { CopyProjectService } from '../assets/wise5/services/copyProjectService';
import { DeleteNodeService } from '../assets/wise5/services/deleteNodeService';
import { ImportComponentService } from '../assets/wise5/services/importComponentService';
import { InsertComponentService } from '../assets/wise5/services/insertComponentService';
import { InsertNodesService } from '../assets/wise5/services/insertNodesService';
import { MoveNodesService } from '../assets/wise5/services/moveNodesService';
import { AuthoringToolModule } from './teacher/authoring-tool.module';
import { ClassroomMonitorModule } from './teacher/classroom-monitor.module';
import { UpdateWorkgroupService } from './services/updateWorkgroupService';
import { GetWorkgroupService } from './services/getWorkgroupService';
import { WorkgroupService } from './services/workgroup.service';
import { TeacherWorkService } from '../assets/wise5/services/teacherWorkService';
import { TeacherDiscussionService } from '../assets/wise5/components/discussion/teacherDiscussionService';
import { NodeInfoService } from '../assets/wise5/services/nodeInfoService';
import { RouterModule } from '@angular/router';
import { setUpLocationSync } from '@angular/router/upgrade';
import { TeacherPeerGroupService } from '../assets/wise5/services/teacherPeerGroupService';
import { DataExportService } from '../assets/wise5/services/dataExportService';
import { TeacherNodeIconComponent } from '../assets/wise5/authoringTool/teacher-node-icon/teacher-node-icon.component';

@Component({ template: `` })
export class EmptyComponent {}

@NgModule({
  declarations: [TeacherNodeIconComponent],
  imports: [
    StudentTeacherCommonModule,
    AuthoringToolModule,
    ClassroomMonitorModule,
    RouterModule.forChild([{ path: '**', component: EmptyComponent }])
  ],
  providers: [
    ClassroomStatusService,
    CopyComponentService,
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
    MoveNodesService,
    NodeInfoService,
    ProjectAssetService,
    SpaceService,
    { provide: ProjectService, useExisting: TeacherProjectService },
    TeacherDataService,
    TeacherDiscussionService,
    TeacherPeerGroupService,
    TeacherProjectService,
    TeacherWebSocketService,
    TeacherWorkService,
    UpdateWorkgroupService,
    WorkgroupService
  ]
})
export class TeacherAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    upgrade.bootstrap(document.body, ['teacher']);
    setUpLocationSync(upgrade);
  }
}
