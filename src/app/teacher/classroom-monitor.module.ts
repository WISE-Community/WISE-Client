import { NgModule } from '@angular/core';
import { NavItemScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/navItemScore/nav-item-score.component';
import { AlertStatusCornerComponent } from '../classroom-monitor/alert-status-corner/alert-status-corner.component';
import { ComponentNewWorkBadgeComponent } from '../classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { ComponentSelectComponent } from '../classroom-monitor/component-select/component-select.component';
import { PeerGroupGradingModule } from './peer-group-grading.module';
import { TeacherSummaryDisplayComponent } from '../../assets/wise5/directives/teacher-summary-display/teacher-summary-display.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { NotebookWorkgroupGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/notebook/notebook-workgroup-grading/notebook-workgroup-grading.component';
import { PauseScreensMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/pause-screens-menu/pause-screens-menu.component';
import { StepItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentGrading/step-item/step-item.component';
import { NodeGradingViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/node-grading-view/node-grading-view.component';
import { NotificationsMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/notifications-menu/notifications-menu.component';
import { NavItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/nav-item/nav-item.component';
import { NodeProgressViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/node-progress-view/node-progress-view.component';
import { NotebookGradingComponent } from '../../assets/wise5/classroomMonitor/notebook-grading/notebook-grading.component';
import { StudentGradingComponent } from '../../assets/wise5/classroomMonitor/student-grading/student-grading.component';
import { StudentProgressComponent } from '../../assets/wise5/classroomMonitor/student-progress/student-progress.component';
import { ClassroomMonitorComponent } from '../../assets/wise5/classroomMonitor/classroom-monitor.component';
import { ShowNodeInfoDialogComponent } from '../classroom-monitor/show-node-info-dialog/show-node-info-dialog.component';
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
    NavItemComponent,
    NodeGradingViewComponent,
    NodeProgressViewComponent,
    NotebookGradingComponent,
    NotebookWorkgroupGradingComponent,
    StudentGradingComponent
  ],
  imports: [
    AlertStatusCornerComponent,
    ClassroomMonitorComponent,
    ComponentGradingComponent,
    ComponentNewWorkBadgeComponent,
    ComponentSelectComponent,
    ComponentStudentModule,
    DataExportModule,
    GradingCommonModule,
    HighchartsChartModule,
    ManageStudentsModule,
    MilestoneModule,
    NavItemScoreComponent,
    NotificationsMenuComponent,
    PauseScreensMenuComponent,
    PeerGroupGradingModule,
    PreviewComponentComponent,
    RouterModule,
    SelectPeriodComponent,
    ShowNodeInfoDialogComponent,
    StepItemComponent,
    StudentProgressComponent,
    StudentTeacherCommonModule,
    TeacherSummaryDisplayComponent
  ],
  providers: [GradingNodeService]
})
export class ClassroomMonitorModule {}
