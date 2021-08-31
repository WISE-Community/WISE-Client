import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-move-user-confirm-dialog',
  templateUrl: './move-user-confirm-dialog.component.html'
})
export class MoveUserConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public isMovingFromWorkgroup: boolean) {}
}
