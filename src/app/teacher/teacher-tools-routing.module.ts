import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassroomMonitorComponent } from '../../assets/wise5/classroomMonitor/classroom-monitor.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ClassroomMonitorComponent
    //     children: [
    //       {
    //         path: 'unit/:unitId',
    //         component: ,
    //         resolve: { project: AuthoringProjectResolver }
    //       }
    //     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherToolsRoutingModule {}
