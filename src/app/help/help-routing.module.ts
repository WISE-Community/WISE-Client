import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { HelpHomeComponent } from './help-home/help-home.component';
import { GettingStartedComponent } from './faq/getting-started/getting-started.component';
import { TeacherFaqComponent } from './faq/teacher-faq/teacher-faq.component';
import { StudentFaqComponent } from './faq/student-faq/student-faq.component';

const helpRoutes: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: [
      { path: '', component: HelpHomeComponent },
      { path: 'getting-started', component: GettingStartedComponent },
      { path: 'teacher-faq', component: TeacherFaqComponent },
      { path: 'student-faq', component: StudentFaqComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(helpRoutes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {}
