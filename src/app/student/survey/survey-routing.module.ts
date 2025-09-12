import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from '../student.component';
import { SurveyCompletedComponent } from './survey-completed/survey-completed.component';
import { WorkgroupLimitReachedComponent } from './workgroup-limit-reached/workgroup-limit-reached.component';

const studentRoutes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: 'completed', component: SurveyCompletedComponent, pathMatch: 'full' },
      {
        path: 'workgroupLimitReached',
        component: WorkgroupLimitReachedComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(studentRoutes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule {}
