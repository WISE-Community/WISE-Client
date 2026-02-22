import { ChangeStudentPasswordDialogComponent } from '../change-student-password-dialog/change-student-password-dialog.component';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../../../services/configService';
import { HttpClient } from '@angular/common/http';
import { ManageShowStudentInfoComponent } from '../manage-show-student-info/manage-show-student-info.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RemoveUserConfirmDialogComponent } from '../remove-user-confirm-dialog/remove-user-confirm-dialog.component';
import { ShowStudentInfoComponent } from '../show-student-info/show-student-info.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatTooltipModule, ShowStudentInfoComponent],
  selector: 'manage-user',
  styleUrl: 'manage-user.component.scss',
  templateUrl: 'manage-user.component.html'
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

  protected viewUserInfo(event: Event): void {
    this.openDialog(event, ManageShowStudentInfoComponent);
  }

  protected removeUser(event: Event): void {
    this.openDialog(event, RemoveUserConfirmDialogComponent)
      .afterClosed()
      .subscribe((doRemoveUser: boolean) => {
        if (doRemoveUser) {
          this.performRemoveUser();
        }
      });
  }

  performRemoveUser(): void {
    const runId = this.configService.getRunId();
    const studentId = this.user.id;
    this.http.delete(`/api/teacher/run/${runId}/student/${studentId}/remove`).subscribe({
      next: () => {
        this.removeUserEvent.emit(this.user);
        this.configService.retrieveConfig(`/api/config/classroomMonitor/${runId}`).subscribe({
          next: () => {
            this.snackBar.open(
              $localize`Removed ${this.user.name} (${this.user.username}) from unit.`
            );
          }
        });
      },
      error: () => {
        this.snackBar.open(
          $localize`Error: Could not remove ${this.user.name} (${this.user.username}) from unit.`
        );
      }
    });
  }

  protected changePassword(event: Event): void {
    this.openDialog(event, ChangeStudentPasswordDialogComponent);
  }

  private openDialog(event: Event, dialogComponent: any): MatDialogRef<any, any> {
    event.preventDefault();
    return this.dialog.open(dialogComponent, {
      data: this.user,
      panelClass: 'dialog-sm'
    });
  }
}
