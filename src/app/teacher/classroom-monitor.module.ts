import { NgModule } from '@angular/core';
import { ComponentNewWorkBadgeComponent } from '../classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { PeerGroupGradingModule } from './peer-group-grading.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { NotebookWorkgroupGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/notebook/notebook-workgroup-grading/notebook-workgroup-grading.component';
import { StepItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/studentGrading/step-item/step-item.component';
import { NotificationsMenuComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/notifications-menu/notifications-menu.component';
import { NavItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/nav-item/nav-item.component';
import { NodeProgressViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/node-progress-view/node-progress-view.component';
import { NotebookGradingComponent } from '../../assets/wise5/classroomMonitor/notebook-grading/notebook-grading.component';
import { StudentGradingComponent } from '../../assets/wise5/classroomMonitor/student-grading/student-grading.component';
import { StudentProgressComponent } from '../../assets/wise5/classroomMonitor/student-progress/student-progress.component';
import { ClassroomMonitorComponent } from '../../assets/wise5/classroomMonitor/classroom-monitor.component';
import { ManageStudentsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-students/manage-students.component';
import { RouterModule } from '@angular/router';
import { SelectPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';
import { GradingNodeService } from '../../assets/wise5/services/gradingNodeService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { MilestonesComponent } from '../classroom-monitor/milestones/milestones.component';

@NgModule({
  imports: [
    ClassroomMonitorComponent,
    ComponentNewWorkBadgeComponent,
    ComponentStudentModule,
    ManageStudentsComponent,
    MilestonesComponent,
    NavItemComponent,
    NotificationsMenuComponent,
    PeerGroupGradingModule,
    RouterModule,
    SelectPeriodComponent,
    StepItemComponent,
    StudentProgressComponent,
    StudentTeacherCommonServicesModule,
    NodeProgressViewComponent,
    NotebookGradingComponent,
    NotebookWorkgroupGradingComponent,
    StudentGradingComponent
  ],
  providers: [GradingNodeService]
})
export class ClassroomMonitorModule {}
