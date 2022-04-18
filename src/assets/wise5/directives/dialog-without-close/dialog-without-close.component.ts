import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogContent } from '../../../../app/domain/dialogContent';

@Component({
  selector: 'dialog-without-close',
  templateUrl: './dialog-without-close.component.html'
})
export class DialogWithoutCloseComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogContent: DialogContent,
    protected dialogRef: MatDialogRef<DialogWithoutCloseComponent>
  ) {}

  ngOnInit(): void {}
}
