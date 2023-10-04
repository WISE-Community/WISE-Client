import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../../../services/configService';
import { ChangeStudentPasswordDialogComponent } from '../change-student-password-dialog/change-student-password-dialog.component';
import { ManageShowStudentInfoComponent } from '../manage-show-student-info/manage-show-student-info.component';
import { RemoveUserConfirmDialogComponent } from '../remove-user-confirm-dialog/remove-user-confirm-dialog.component';

@Component({
  selector: 'manage-user',
  styleUrls: ['manage-user.component.scss'],
  templateUrl: 'manage-user.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ManageUserComponent {
  @Input() user: any;
  @Output() removeUserEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  viewUserInfo(event: Event) {
    event.preventDefault();
    this.dialog.open(ManageShowStudentInfoComponent, {
      data: this.user,
      panelClass: 'dialog-sm'
    });
  }

  removeUser(event: Event) {
    event.preventDefault();
    this.dialog
      .open(RemoveUserConfirmDialogComponent, {
        data: this.user,
        panelClass: 'dialog-sm'
      })
      .afterClosed()
      .subscribe((doRemoveUser: boolean) => {
        if (doRemoveUser) {
          this.performRemoveUser();
        }
      });
  }

  performRemoveUser() {
    const runId = this.configService.getRunId();
    const studentId = this.user.id;
    this.http.delete(`/api/teacher/run/${runId}/student/${studentId}/remove`).subscribe({
      next: () => {
        this.removeUserEvent.emit(this.user);
        this.snackBar.open($localize`Removed ${this.user.name} (${this.user.username}) from unit.`);
        this.configService.retrieveConfig(`/api/config/classroomMonitor/${runId}`);
      },
      error: () => {
        this.snackBar.open(
          $localize`Error: Could not remove ${this.user.name} (${this.user.username}) from unit.`
        );
      }
    });
  }

  changePassword(event: Event) {
    event.preventDefault();
    this.dialog.open(ChangeStudentPasswordDialogComponent, {
      data: this.user,
      panelClass: 'dialog-sm'
    });
  }
}
