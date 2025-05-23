import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from '../student.component';
import { WorkgroupLimitReachedComponent } from './workgroup-limit-reached/workgroup-limit-reached.component';
import { LogOutPageComponent } from './log-out-page/log-out-page.component';

const studentRoutes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      {
        path: 'workgroupLimitReached',
        component: WorkgroupLimitReachedComponent,
        pathMatch: 'full'
      },
      { path: 'logout', component: LogOutPageComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(studentRoutes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule {}
