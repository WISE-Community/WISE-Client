import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { ManageShowStudentInfoComponent } from '../manage-show-student-info/manage-show-student-info.component';
import { RemoveUserConfirmDialogComponent } from '../remove-user-confirm-dialog/remove-user-confirm-dialog.component';

@Component({
  selector: 'manage-user',
  templateUrl: 'manage-user.component.html'
})
export class ManageUserComponent {
  @Input() user: any;

  canViewStudentNames: boolean;

  constructor(private dialog: MatDialog, private ConfigService: ConfigService) {}

  ngOnInit() {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
  }

  viewUserInfo(event: Event) {
    event.preventDefault();
    this.dialog.open(ManageShowStudentInfoComponent, {
      data: this.user,
      panelClass: 'mat-dialog--sm'
    });
  }

  removeUser(event: Event) {
    event.preventDefault();
    this.dialog.open(RemoveUserConfirmDialogComponent, {
      data: this.user,
      panelClass: 'mat-dialog--sm'
    });
  }
}
