import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'html-dialg',
  templateUrl: 'html-dialog.html'
})
export class HtmlDialog {
  content: string;
  isShowCloseButton: boolean;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HtmlDialog>
  ) {
    this.content = data.content;
    this.isShowCloseButton = data.isShowCloseButton;
    this.title = data.title;
  }

  close(): void {
    this.dialogRef.close();
  }
}
