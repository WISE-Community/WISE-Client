import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'app-remove-user-confirm-dialog',
  templateUrl: './remove-user-confirm-dialog.component.html',
  styleUrls: ['./remove-user-confirm-dialog.component.scss']
})
export class RemoveUserConfirmDialogComponent implements OnInit {
  constructor(private configService: ConfigService, @Inject(MAT_DIALOG_DATA) public user: any) {}

  studentDisplayName: string;

  ngOnInit(): void {
    this.studentDisplayName = this.configService.getPermissions().canViewStudentNames
      ? `${this.user.name} (${this.user.username})`
      : `Student ${this.user.id}`;
  }
}
