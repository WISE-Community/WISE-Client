import { NgModule } from '@angular/core';
import { ComponentNewWorkBadgeComponent } from '../classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { PeerGroupGradingModule } from './peer-group-grading.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { NotebookWorkgroupGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/notebook/notebook-workgroup-grading/notebook-workgroup-grading.component';
import { PauseScreensMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/pause-screens-menu/pause-screens-menu.component';
import { StepItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentGrading/step-item/step-item.component';
import { NotificationsMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/notifications-menu/notifications-menu.component';
import { NavItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/nav-item/nav-item.component';
import { NodeProgressViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/node-progress-view/node-progress-view.component';
import { NotebookGradingComponent } from '../../assets/wise5/classroomMonitor/notebook-grading/notebook-grading.component';
import { StudentGradingComponent } from '../../assets/wise5/classroomMonitor/student-grading/student-grading.component';
import { StudentProgressComponent } from '../../assets/wise5/classroomMonitor/student-progress/student-progress.component';
import { ClassroomMonitorComponent } from '../../assets/wise5/classroomMonitor/classroom-monitor.component';
import { MilestoneModule } from './milestone/milestone.module';
import { GradingCommonModule } from './grading-common.module';
import { ManageStudentsModule } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-students.module';
import { DataExportModule } from '../../assets/wise5/classroomMonitor/dataExport/data-export.module';
import { RouterModule } from '@angular/router';
import { PreviewComponentComponent } from '../../assets/wise5/authoringTool/components/preview-component/preview-component.component';
import { ComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/component-grading.component';
import { SelectPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';
import { GradingNodeService } from '../../assets/wise5/services/gradingNodeService';

@NgModule({
  declarations: [
    NodeProgressViewComponent,
    NotebookGradingComponent,
    NotebookWorkgroupGradingComponent,
    StudentGradingComponent
  ],
  imports: [
    ClassroomMonitorComponent,
    ComponentGradingComponent,
    ComponentNewWorkBadgeComponent,
    ComponentStudentModule,
    DataExportModule,
    GradingCommonModule,
    HighchartsChartModule,
    ManageStudentsModule,
    MilestoneModule,
    NavItemComponent,
    NotificationsMenuComponent,
    PauseScreensMenuComponent,
    PeerGroupGradingModule,
    PreviewComponentComponent,
    RouterModule,
    SelectPeriodComponent,
    StepItemComponent,
    StudentProgressComponent,
    StudentTeacherCommonModule
  ],
  providers: [GradingNodeService]
})
export class ClassroomMonitorModule {}
