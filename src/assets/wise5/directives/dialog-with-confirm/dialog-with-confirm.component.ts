import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogWithoutCloseComponent } from '../dialog-without-close/dialog-without-close.component';

@Component({
  selector: 'dialog-with-confirm',
  templateUrl: './dialog-with-confirm.component.html',
  styleUrls: ['./dialog-with-confirm.component.scss']
})
export class DialogWithConfirmComponent extends DialogWithoutCloseComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected dialogRef: MatDialogRef<DialogWithConfirmComponent>
  ) {
    super(data, dialogRef);
  }
}
