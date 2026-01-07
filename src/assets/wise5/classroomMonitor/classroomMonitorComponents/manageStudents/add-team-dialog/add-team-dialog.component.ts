import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../../../services/configService';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MoveUserConfirmDialogComponent } from '../move-user-confirm-dialog/move-user-confirm-dialog.component';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ShowStudentInfoComponent } from '../show-student-info/show-student-info.component';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    ShowStudentInfoComponent,
    MatIconButton,
    MatIcon,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatProgressBar
  ],
  styleUrl: './add-team-dialog.component.scss',
  templateUrl: './add-team-dialog.component.html'
})
export class AddTeamDialogComponent {
  protected dialog = inject(MatDialog);
  private configService = inject(ConfigService);
  period = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);
  private workgroupService = inject(WorkgroupService);

  allUsersInPeriod: any[] = [];
  initialTeamMembers: any[] = [];
  isProcessing: boolean;
  isAnyUnassignedStudent: boolean;

  ngOnInit(): void {
    this.allUsersInPeriod = this.configService
      .getAllUsersInPeriod(this.period.periodId)
      .sort((userA, userB) => {
        return userA.name.localeCompare(userB.name);
      });
    this.isAnyUnassignedStudent = this.allUsersInPeriod.some((student) => {
      return !this.isUserInAnyWorkgroup(student);
    });
  }

  addTeamMember(user: any) {
    this.initialTeamMembers.push(user);
  }

  deleteTeamMember(index: number) {
    this.initialTeamMembers.splice(index, 1)[0];
  }

  createTeam(): void {
    this.isProcessing = true;
    if (this.isAnyMemberInWorkgroup()) {
      this.createTeamAfterConfirm();
    } else {
      this.createTeamOnServer();
    }
  }

  private createTeamAfterConfirm() {
    this.dialog
      .open(MoveUserConfirmDialogComponent, {
        panelClass: 'dialog-sm',
        data: true
      })
      .afterClosed()
      .subscribe((doMoveUser: boolean) => {
        if (doMoveUser) {
          this.createTeamOnServer();
        } else {
          this.isProcessing = false;
        }
      });
  }

  private createTeamOnServer(): void {
    this.workgroupService
      .createWorkgroup(
        this.period.periodId,
        this.initialTeamMembers.map((member) => member.id)
      )
      .subscribe({
        next: (newWorkgroupId: number) => {
          this.configService
            .retrieveConfig(`/api/config/classroomMonitor/${this.configService.getRunId()}`)
            .subscribe({
              next: () => {
                this.snackBar.open($localize`New Team ${newWorkgroupId} has been created.`);
                this.isProcessing = false;
                this.dialog.closeAll();
              }
            });
        },
        error: () => {
          this.snackBar.open($localize`Error: Could not create team.`);
        }
      });
  }

  private isAnyMemberInWorkgroup(): boolean {
    return this.initialTeamMembers.some((user) => {
      return this.isUserInAnyWorkgroup(user);
    });
  }

  isUserInAnyWorkgroup(user: any): boolean {
    return this.workgroupService.isUserInAnyWorkgroup(user);
  }
}
