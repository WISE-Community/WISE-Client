import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    protected dialog: MatDialog,
    private ConfigService: ConfigService,
    private snackBar: MatSnackBar,
    private TeacherDataService: TeacherDataService,
    private WorkgroupService: WorkgroupService
  ) {}

  ngOnInit(): void {
    this.allUsersInPeriod = this.ConfigService.getAllUsersInPeriod(
      this.TeacherDataService.getCurrentPeriodId()
    ).sort((userA, userB) => {
      return userA.name.localeCompare(userB.name);
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
        panelClass: 'mat-dialog--sm'
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
      this.TeacherDataService.getCurrentPeriodId(),
      this.initialTeamMembers.map((member) => member.id)
    ).subscribe((newWorkgroupId: number) => {
      this.ConfigService.retrieveConfig(
        `/api/config/classroomMonitor/${this.ConfigService.getRunId()}`
      );
      this.snackBar.open($localize`New team ${newWorkgroupId} has been created`);
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
