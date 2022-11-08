import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'dialog-with-open-in-new-window',
  templateUrl: './dialog-with-open-in-new-window.component.html',
  styleUrls: ['./dialog-with-open-in-new-window.component.scss']
})
export class DialogWithOpenInNewWindowComponent extends DialogComponent {
  openInNewWindow(): void {
    const w = window.open('', '_blank');
    const content = `<h2>${this.dialogData.title}</h2><div>${this.dialogData.content}</div>`;
    w.document.write(content);
    this.dialogRef.close();
  }
}
