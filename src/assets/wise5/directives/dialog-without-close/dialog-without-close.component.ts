import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dialog-without-close',
  templateUrl: './dialog-without-close.component.html',
  styleUrls: ['./dialog-without-close.component.scss']
})
export class DialogWithoutCloseComponent implements OnInit {
  content: string;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected dialogRef: MatDialogRef<DialogWithoutCloseComponent>
  ) {
    this.content = data.content;
    this.title = data.title;
  }

  ngOnInit(): void {}
}
