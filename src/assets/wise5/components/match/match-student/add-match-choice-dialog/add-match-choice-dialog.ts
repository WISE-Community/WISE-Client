import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'add-match-choice-dialog',
  templateUrl: 'add-match-choice-dialog.html'
})
export class AddMatchChoiceDialog {
  choiceText: string;

  constructor(private dialogRef: MatDialogRef<AddMatchChoiceDialog>) {}

  enterPressed(): void {
    this.dialogRef.close(this.choiceText);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
