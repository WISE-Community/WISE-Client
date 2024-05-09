import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotHomeComponent } from './forgot-home/forgot-home.component';
import { ForgotComponent } from './forgot.component';
import { SharedModule } from '../modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ForgotStudentComponent } from './student/forgot-student/forgot-student.component';
import { ForgotTeacherComponent } from './teacher/forgot-teacher/forgot-teacher.component';
import { ForgotStudentPasswordComponent } from './student/forgot-student-password/forgot-student-password.component';
import { ForgotStudentUsernameComponent } from './student/forgot-student-username/forgot-student-username.component';
import { ForgotTeacherUsernameComponent } from './teacher/forgot-teacher-username/forgot-teacher-username.component';
import { ForgotTeacherPasswordComponent } from './teacher/forgot-teacher-password/forgot-teacher-password.component';
import { ForgotStudentPasswordSecurityComponent } from './student/forgot-student-password-security/forgot-student-password-security.component';
import { ForgotStudentPasswordChangeComponent } from './student/forgot-student-password-change/forgot-student-password-change.component';
import { ForgotTeacherUsernameCompleteComponent } from './teacher/forgot-teacher-username-complete/forgot-teacher-username-complete.component';
import { ForgotTeacherPasswordChangeComponent } from './teacher/forgot-teacher-password-change/forgot-teacher-password-change.component';
import { ForgotTeacherPasswordVerifyComponent } from './teacher/forgot-teacher-password-verify/forgot-teacher-password-verify.component';
import { PasswordModule } from '../password/password.module';
import { ForgotUserPasswordCompleteComponent } from './forgot-user-password-complete/forgot-user-password-complete.component';
import { CallToActionComponent } from '../modules/shared/call-to-action/call-to-action.component';

@NgModule({
  imports: [
    CallToActionComponent,
    CommonModule,
    ForgotRoutingModule,
    FormsModule,
    MatDividerModule,
    MatProgressBarModule,
    PasswordModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ForgotComponent,
    ForgotHomeComponent,
    ForgotStudentComponent,
    ForgotTeacherComponent,
    ForgotStudentPasswordComponent,
    ForgotStudentUsernameComponent,
    ForgotTeacherUsernameComponent,
    ForgotTeacherPasswordComponent,
    ForgotStudentPasswordSecurityComponent,
    ForgotStudentPasswordChangeComponent,
    ForgotTeacherUsernameCompleteComponent,
    ForgotTeacherPasswordChangeComponent,
    ForgotTeacherPasswordVerifyComponent,
    ForgotUserPasswordCompleteComponent
  ],
  exports: [ForgotComponent]
})
export class ForgotModule {}
