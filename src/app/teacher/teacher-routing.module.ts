import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { EditComponent } from './account/edit/edit.component';

const teacherRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./teacher.component').then((m) => m.TeacherComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'profile', redirectTo: 'profile/edit', pathMatch: 'full' },
      { path: 'profile/edit', component: EditComponent },
      {
        path: 'home',
        loadComponent: () =>
          import('./teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
        children: [
          { path: 'library/personal', redirectTo: '/curriculum/personal' },
          { path: 'library', redirectTo: '/curriculum' },
          { path: 'schedule', redirectTo: '' }
        ]
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('./teacher-authoring.module').then((m) => m.TeacherAuthoringModule)
      },
      {
        path: 'manage',
        loadChildren: () => import('./teacher-tools.module').then((m) => m.TeacherToolsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(teacherRoutes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
