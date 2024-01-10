import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassroomMonitorComponent } from '../../assets/wise5/classroomMonitor/classroom-monitor.component';
import { TeacherToolsResolver } from './teacher-tools.resolver';
import { NodeProgressViewComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/node-progress-view/node-progress-view.component';
import { StudentProgressComponent } from '../../assets/wise5/classroomMonitor/student-progress/student-progress.component';
import { StudentGradingComponent } from '../../assets/wise5/classroomMonitor/student-grading/student-grading.component';
import { StudentDataResolver } from './student-data.resolver';
import { DataExportComponent } from '../../assets/wise5/classroomMonitor/dataExport/data-export/data-export.component';
import { ExportStepVisitsComponent } from '../../assets/wise5/classroomMonitor/dataExport/export-step-visits/export-step-visits.component';
import { ManageStudentsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-students/manage-students.component';
import { NotebookGradingComponent } from '../../assets/wise5/classroomMonitor/notebook-grading/notebook-grading.component';
import { MilestonesComponent } from '../classroom-monitor/milestones/milestones.component';

const routes: Routes = [
  {
    path: 'unit/:unitId',
    component: ClassroomMonitorComponent,
    resolve: { teacherData: TeacherToolsResolver },
    children: [
      { path: '', component: NodeProgressViewComponent },
      { path: 'export', component: DataExportComponent },
      { path: 'export/visits', component: ExportStepVisitsComponent },
      { path: 'manage-students', component: ManageStudentsComponent },
      { path: 'milestones', component: MilestonesComponent },
      { path: 'node/:nodeId', component: NodeProgressViewComponent },
      { path: 'notebook', component: NotebookGradingComponent },
      {
        path: 'team',
        component: StudentProgressComponent
      },
      {
        path: 'team/:workgroupId',
        component: StudentGradingComponent,
        resolve: { studentData: StudentDataResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherToolsRoutingModule {}
