import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { EditTagComponent } from '../edit-tag/edit-tag.component';

@Component({
  selector: 'create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    EditTagComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class CreateTagDialogComponent {
  protected nameControl = new FormControl('', [Validators.required]);
  protected colorControl = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private projectTagService: ProjectTagService,
    private snackBar: MatSnackBar
  ) {}

  protected create(): void {
    this.projectTagService
      .createTag(this.nameControl.value.trim(), this.colorControl.value.trim())
      .subscribe({
        next: () => {
          this.snackBar.open($localize`Tag created`);
          this.dialogRef.close();
        },
        error: ({ error }) => {
          if (error.messageCode === 'tagAlreadyExists') {
            this.nameControl.setErrors({ tagAlreadyExists: true });
          }
        }
      });
  }
}
