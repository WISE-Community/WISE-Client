import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './dialog-with-open-in-new-window.component.html'
})
export class DialogWithOpenInNewWindowComponent extends DialogComponent {
  openInNewWindow(): void {
    const w = window.open('', '_blank');
    const content = `<h2>${this.dialogData.title}</h2><div>${this.dialogData.content}</div>`;
    w.document.write(content);
    this.dialogRef.close();
  }
}
