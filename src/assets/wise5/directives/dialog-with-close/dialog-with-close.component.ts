import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogWithoutCloseComponent } from '../dialog-without-close/dialog-without-close.component';

@Component({
  selector: 'dialog-with-close',
  templateUrl: './dialog-with-close.component.html',
  styleUrls: ['./dialog-with-close.component.scss']
})
export class DialogWithCloseComponent extends DialogWithoutCloseComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected dialogRef: MatDialogRef<DialogWithoutCloseComponent>
  ) {
    super(data, dialogRef);
  }
}
