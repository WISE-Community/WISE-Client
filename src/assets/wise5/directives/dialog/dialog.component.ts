import { Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../app/domain/dialogData';

@Directive()
export abstract class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    protected dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {}
}
