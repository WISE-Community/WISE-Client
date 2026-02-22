import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { UnlinkGoogleAccountPasswordComponent } from '../unlink-google-account-password/unlink-google-account-password.component';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  styleUrl: './unlink-google-account-confirm.component.scss',
  templateUrl: './unlink-google-account-confirm.component.html'
})
export class UnlinkGoogleAccountConfirmComponent {
  constructor(public dialog: MatDialog) {}

  continue() {
    this.dialog.closeAll();
    this.dialog.open(UnlinkGoogleAccountPasswordComponent, {
      panelClass: 'dialog-sm'
    });
  }
}
