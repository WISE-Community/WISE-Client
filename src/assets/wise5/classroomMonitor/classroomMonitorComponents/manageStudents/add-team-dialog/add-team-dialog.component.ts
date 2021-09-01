import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoveUserConfirmDialogComponent } from '../move-user-confirm-dialog/move-user-confirm-dialog.component';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';

@Component({
  selector: 'add-team-dialog',
  templateUrl: './add-team-dialog.component.html',
  styleUrls: ['./add-team-dialog.component.scss']
})
export class AddTeamDialogComponent {
  allUsersInPeriod: any[] = [];
  initialTeamMembers: any[] = [];
  isProcessing: boolean;
  isAnyUnassignedStudent: boolean;

  constructor(
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public period: any,
    private ConfigService: ConfigService,
    private snackBar: MatSnackBar,
    private WorkgroupService: WorkgroupService
  ) {}

  ngOnInit(): void {
    this.allUsersInPeriod = this.ConfigService.getAllUsersInPeriod(this.period.periodId).sort(
      (userA, userB) => {
        return userA.name.localeCompare(userB.name);
      }
    );
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
    this.WorkgroupService.createWorkgroup(
      this.period.periodId,
      this.initialTeamMembers.map((member) => member.id)
    ).subscribe((newWorkgroupId: number) => {
      this.ConfigService.retrieveConfig(
        `/api/config/classroomMonitor/${this.ConfigService.getRunId()}`
      );
      this.snackBar.open($localize`New team ${newWorkgroupId} has been created.`);
      this.isProcessing = false;
      this.dialog.closeAll();
    });
  }

  private isAnyMemberInWorkgroup(): boolean {
    return this.initialTeamMembers.some((user) => {
      return this.isUserInAnyWorkgroup(user);
    });
  }

  isUserInAnyWorkgroup(user: any): boolean {
    return this.WorkgroupService.isUserInAnyWorkgroup(user);
  }
}
