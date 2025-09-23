import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatError,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: 'add-match-choice-dialog.html'
})
export class AddMatchChoiceDialogComponent {
  protected addChoiceFormGroup: FormGroup = this.fb.group({
    choiceText: new FormControl('', [Validators.required])
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMatchChoiceDialogComponent>
  ) {}

  protected save(): void {
    const choiceText: string = this.addChoiceFormGroup.get('choiceText').value;
    if (choiceText) {
      this.closeDialog(choiceText);
    }
  }

  protected closeDialog(text?: string): void {
    this.dialogRef.close(text);
  }
}
