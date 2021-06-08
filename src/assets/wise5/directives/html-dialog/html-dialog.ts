import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'html-dialg',
  templateUrl: 'html-dialog.html'
})
export class HtmlDialog {
  title: string;
  content: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HtmlDialog>
  ) {
    this.title = data.title;
    this.content = data.content;
  }

  close(): void {
    this.dialogRef.close();
  }
}
