import { Component, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './remove-user-confirm-dialog.component.html'
})
export class RemoveUserConfirmDialogComponent implements OnInit {
  private configService = inject(ConfigService);
  user = inject(MAT_DIALOG_DATA);

  protected studentDisplayName: string;

  ngOnInit(): void {
    this.studentDisplayName = this.configService.getPermissions().canViewStudentNames
      ? `${this.user.name} (${this.user.username})`
      : $localize`Student ${this.user.id}`;
  }
}
