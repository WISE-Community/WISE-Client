import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    DatePipe
  ],
  styleUrl: './manage-show-student-info.component.scss',
  templateUrl: './manage-show-student-info.component.html'
})
export class ManageShowStudentInfoComponent {
  protected dialog = inject(MatDialog);
  private configService = inject(ConfigService);
  private http = inject(HttpClient);
  user = inject(MAT_DIALOG_DATA);

  protected canViewStudentNames: boolean;

  ngOnInit() {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.http.get(`/api/user/info/${this.user.id}`).subscribe((userInfo) => {
      Object.assign(this.user, userInfo);
    });
  }
}
