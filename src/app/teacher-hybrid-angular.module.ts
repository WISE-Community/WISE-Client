import { NgModule } from '@angular/core';

import '../assets/wise5/teacher/teacher-angular-js-module';
import { AngularJSModule, bootstrapAngularJSModule } from './common-hybrid-angular.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from '../assets/wise5/services/projectService';
import { TeacherProjectService } from '../assets/wise5/services/teacherProjectService';
import { ProjectAssetService } from './services/projectAssetService';
import { SpaceService } from '../assets/wise5/services/spaceService';
import { StudentStatusService } from '../assets/wise5/services/studentStatusService';
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
import { StepToolsComponent } from '../assets/wise5/common/stepTools/step-tools.component';

@NgModule({
  declarations: [StepToolsComponent],
  imports: [AngularJSModule, AuthoringToolModule, ClassroomMonitorModule],
  providers: [
    CopyComponentService,
    CopyNodesService,
    CopyProjectService,
    { provide: DataService, useExisting: TeacherDataService },
    DeleteNodeService,
    ImportComponentService,
    InsertComponentService,
    InsertNodesService,
    MilestoneService,
    MoveNodesService,
    ProjectAssetService,
    SpaceService,
    StudentStatusService,
    { provide: ProjectService, useExisting: TeacherProjectService },
    TeacherDataService,
    TeacherProjectService,
    TeacherWebSocketService
  ]
})
export class TeacherAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    bootstrapAngularJSModule(upgrade, 'teacher');
  }
}
