import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-match-choice-dialog',
  templateUrl: 'add-match-choice-dialog.html'
})
export class AddMatchChoiceDialog {
  addChoiceFormGroup: FormGroup = this.fb.group({
    choiceText: new FormControl('', [Validators.required])
  });

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddMatchChoiceDialog>) {}

  protected save(): void {
    const choiceText: string = this.addChoiceFormGroup.get('choiceText').value;
    if (choiceText) {
      this.dialogRef.close(choiceText);
    }
  }
}
