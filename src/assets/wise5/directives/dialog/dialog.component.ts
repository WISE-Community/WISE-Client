import { Directive, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../app/domain/dialogData';

@Directive()
export abstract class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    protected dialogRef: MatDialogRef<DialogComponent>
  ) {}
}
