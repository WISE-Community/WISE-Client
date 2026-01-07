import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './move-user-confirm-dialog.component.html'
})
export class MoveUserConfirmDialogComponent {
  isMovingFromWorkgroup = inject(MAT_DIALOG_DATA);
}
