import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './move-user-confirm-dialog.component.html'
})
export class MoveUserConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public isMovingFromWorkgroup: boolean) {}
}
