import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnlinkGoogleAccountConfirmComponent } from '../../modules/shared/unlink-google-account-confirm/unlink-google-account-confirm.component';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  changed: boolean = false;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {}

  handleUpdateProfileResponse(response) {
    if (response.status === 'success') {
      this.changed = false;
      this.snackBar.open($localize`Profile updated.`);
    } else {
      this.snackBar.open($localize`An error occurred. Please try again.`);
    }
  }

  unlinkGoogleAccount() {
    this.dialog.open(UnlinkGoogleAccountConfirmComponent, {
      panelClass: 'dialog-sm'
    });
  }
}
