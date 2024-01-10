import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { ManagePeriodComponent } from './manage-period/manage-period.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ShowStudentInfoComponent } from './show-student-info/show-student-info.component';
import { ManageShowStudentInfoComponent } from './manage-show-student-info/manage-show-student-info.component';
import { RemoveUserConfirmDialogComponent } from './remove-user-confirm-dialog/remove-user-confirm-dialog.component';
import { MoveUserConfirmDialogComponent } from './move-user-confirm-dialog/move-user-confirm-dialog.component';
import { AddTeamButtonComponent } from './add-team-button/add-team-button.component';
import { AddTeamDialogComponent } from './add-team-dialog/add-team-dialog.component';
import { ChangeStudentPasswordDialogComponent } from './change-student-password-dialog/change-student-password-dialog.component';
import { ChangeTeamPeriodDialogComponent } from './change-team-period-dialog/change-team-period-dialog.component';
import { PasswordModule } from '../../../../../app/password/password.module';

@NgModule({
  imports: [PasswordModule, StudentTeacherCommonModule],
  declarations: [
    AddTeamButtonComponent,
    AddTeamDialogComponent,
    ChangeStudentPasswordDialogComponent,
    ChangeTeamPeriodDialogComponent,
    ManagePeriodComponent,
    ManageShowStudentInfoComponent,
    ManageStudentsComponent,
    ManageTeamComponent,
    ManageTeamsComponent,
    ManageUserComponent,
    MoveUserConfirmDialogComponent,
    RemoveUserConfirmDialogComponent,
    ShowStudentInfoComponent
  ],
  exports: [ManageStudentsComponent]
})
export class ManageStudentsModule {}
