import { NgModule } from '@angular/core';
import { HelpComponent } from './help.component';
import { HelpRoutingModule } from './help-routing.module';
import { GettingStartedComponent } from './faq/getting-started/getting-started.component';
import { TeacherFaqComponent } from './faq/teacher-faq/teacher-faq.component';
import { StudentFaqComponent } from './faq/student-faq/student-faq.component';
import { HelpHomeComponent } from './help-home/help-home.component';

@NgModule({
  imports: [
    GettingStartedComponent,
    HelpComponent,
    HelpHomeComponent,
    HelpRoutingModule,
    StudentFaqComponent,
    TeacherFaqComponent
  ]
})
export class HelpModule {}
