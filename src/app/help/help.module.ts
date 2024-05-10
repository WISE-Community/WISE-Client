import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { HelpRoutingModule } from './help-routing.module';
import { SharedModule } from '../modules/shared/shared.module';
import { GettingStartedComponent } from './faq/getting-started/getting-started.component';
import { TeacherFaqComponent } from './faq/teacher-faq/teacher-faq.component';
import { StudentFaqComponent } from './faq/student-faq/student-faq.component';
import { HelpHomeComponent } from './help-home/help-home.component';
import { MatDividerModule } from '@angular/material/divider';
import { CallToActionComponent } from '../modules/shared/call-to-action/call-to-action.component';

@NgModule({
  imports: [CallToActionComponent, CommonModule, HelpRoutingModule, MatDividerModule, SharedModule],
  declarations: [
    HelpComponent,
    GettingStartedComponent,
    TeacherFaqComponent,
    StudentFaqComponent,
    HelpHomeComponent
  ]
})
export class HelpModule {}
