import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'preview/unit/:unitId',
    loadChildren: () =>
      import('../../../../src/app/student/vle/student-vle.module').then((m) => m.StudentVLEModule)
  },
  {
    path: 'student/unit/:unitId',
    loadChildren: () =>
      import('../../../../src/app/student/vle/student-vle.module').then((m) => m.StudentVLEModule)
  },
  {
    path: '',
    loadChildren: () => import('../../../../src/app/app.module').then((m) => m.AppModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
