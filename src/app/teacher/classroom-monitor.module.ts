import { NgModule } from '@angular/core';
import { AddTeamButtonComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/add-team-button/add-team-button.component';
import { AddTeamDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/add-team-dialog/add-team-dialog.component';
import { ChangeStudentPasswordDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/change-student-password-dialog/change-student-password-dialog.component';
import { EditComponentAnnotationsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { EditComponentCommentComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
import { ManagePeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-period/manage-period.component';
import { ManageStudentsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-students/manage-students.component';
import { ManageTeamComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-team/manage-team.component';
import { ManageTeamsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-teams/manage-teams.component';
import { ManageUserComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-user/manage-user.component';
import { MoveUserConfirmDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/move-user-confirm-dialog/move-user-confirm-dialog.component';
import { WorkgroupInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { WorkgroupItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroup-item/workgroup-item.component';
import { NavItemScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/navItemScore/nav-item-score.component';
import { WorkgroupNodeScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { ViewComponentRevisionsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/view-component-revisions/view-component-revisions.component';
import { WorkgroupComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import { AlertStatusCornerComponent } from '../classroom-monitor/alert-status-corner/alert-status-corner.component';
import { ComponentNewWorkBadgeComponent } from '../classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { ComponentSelectComponent } from '../classroom-monitor/component-select/component-select.component';
import { MilestonesComponent } from '../classroom-monitor/milestones/milestones.component';
import { NavItemProgressComponent } from '../classroom-monitor/nav-item-progress/nav-item-progress.component';
import { ShowStudentInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/show-student-info/show-student-info.component';
import { StatusIconComponent } from '../classroom-monitor/status-icon/status-icon.component';
import { StepInfoComponent } from '../classroom-monitor/step-info/step-info.component';
import { WorkgroupNodeStatusComponent } from '../classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { WorkgroupSelectDropdownComponent } from '../classroom-monitor/workgroup-select/workgroup-select-dropdown/workgroup-select-dropdown.component';
import { MilestoneReportDataComponent } from './milestone/milestone-report-data/milestone-report-data.component';
import { ChangeTeamPeriodDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/change-team-period-dialog/change-team-period-dialog.component';
import { ManageShowStudentInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-show-student-info/manage-show-student-info.component';
import { RemoveUserConfirmDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/remove-user-confirm-dialog/remove-user-confirm-dialog.component';
import { PeerGroupGradingModule } from './peer-group-grading.module';
import { SelectPeriodModule } from './select-period.module';
import { ComponentGradingModule } from './component-grading.module';
import { TeacherSummaryDisplay } from '../../assets/wise5/directives/teacher-summary-display/teacher-summary-display.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { MilestoneWorkgroupItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-workgroup-item/milestone-workgroup-item.component';
import { NodeInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/node-info/node-info.component';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { PreviewComponentModule } from '../../assets/wise5/authoringTool/components/preview-component/preview-component.module';
import { NotebookWorkgroupGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/notebook/notebook-workgroup-grading/notebook-workgroup-grading.component';
import { ProjectProgressComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentProgress/project-progress/project-progress.component';
import { PauseScreensMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/pause-screens-menu/pause-screens-menu.component';
import { StepItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentGrading/step-item/step-item.component';
import { StudentGradingToolsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentGrading/student-grading-tools/student-grading-tools.component';
import { ToolBarComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/tool-bar/tool-bar.component';
import { StepToolsComponent } from '../../assets/wise5/common/stepTools/step-tools.component';
import { NodeGradingViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/node-grading-view/node-grading-view.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { MilestoneGradingViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-grading-view/milestone-grading-view.component';
import { NotificationsMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/notifications-menu/notifications-menu.component';
import { NavItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/nav-item/nav-item.component';
import { NodeProgressViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/node-progress-view/node-progress-view.component';
import { TopBarComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/top-bar/top-bar.component';
import { NotebookGradingComponent } from '../../assets/wise5/classroomMonitor/notebook-grading/notebook-grading.component';
import { StudentGradingComponent } from '../../assets/wise5/classroomMonitor/student-grading/student-grading.component';
import { ExportStepVisitsComponent } from '../../assets/wise5/classroomMonitor/dataExport/export-step-visits/export-step-visits.component';
import { DataExportComponent } from '../../assets/wise5/classroomMonitor/dataExport/data-export/data-export.component';

@NgModule({
  declarations: [
    AddTeamButtonComponent,
    AddTeamDialogComponent,
    AlertStatusCornerComponent,
    ChangeStudentPasswordDialogComponent,
    ChangeTeamPeriodDialogComponent,
    ComponentNewWorkBadgeComponent,
    ComponentSelectComponent,
    DataExportComponent,
    EditComponentAnnotationsComponent,
    EditComponentCommentComponent,
    EditComponentScoreComponent,
    ExportStepVisitsComponent,
    GradingEditComponentMaxScoreComponent,
    ManagePeriodComponent,
    ManageShowStudentInfoComponent,
    ManageStudentsComponent,
    ManageTeamComponent,
    ManageTeamsComponent,
    ManageUserComponent,
    MilestonesComponent,
    MilestoneGradingViewComponent,
    MilestoneReportDataComponent,
    MilestoneWorkgroupItemComponent,
    MoveUserConfirmDialogComponent,
    NavItemComponent,
    NavItemProgressComponent,
    NodeInfoComponent,
    NodeGradingViewComponent,
    NodeProgressViewComponent,
    NotebookGradingComponent,
    NotebookWorkgroupGradingComponent,
    NotificationsMenuComponent,
    PauseScreensMenuComponent,
    ProjectProgressComponent,
    RemoveUserConfirmDialogComponent,
    ShowStudentInfoComponent,
    StatusIconComponent,
    StepInfoComponent,
    StepItemComponent,
    StepToolsComponent,
    StudentGradingComponent,
    StudentGradingToolsComponent,
    TeacherSummaryDisplay,
    ToolBarComponent,
    TopBarComponent,
    ViewComponentRevisionsComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupItemComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupSelectAutocompleteComponent,
    WorkgroupSelectDropdownComponent,
    NavItemScoreComponent,
    WorkgroupNodeStatusComponent
  ],
  imports: [
    StudentTeacherCommonModule,
    ComponentGradingModule,
    ComponentStudentModule,
    HighchartsChartModule,
    IntersectionObserverModule,
    PeerGroupGradingModule,
    PreviewComponentModule,
    SelectPeriodModule
  ]
})
export class ClassroomMonitorModule {}
