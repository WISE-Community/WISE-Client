import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { Tag } from '../../domain/tag';
import { EditTagComponent } from '../edit-tag/edit-tag.component';

@Component({
  selector: 'edit-tag-dialog',
  templateUrl: './edit-tag-dialog.component.html',
  styleUrls: ['./edit-tag-dialog.component.scss'],
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
export class EditTagDialogComponent {
  protected nameControl = new FormControl('', [Validators.required]);
  protected colorControl = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private projectTagService: ProjectTagService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) protected tag: Tag
  ) {}

  protected save(): void {
    this.tag.text = this.nameControl.value.trim();
    this.tag.color = this.colorControl.value.trim();
    this.projectTagService.updateTag(this.tag).subscribe({
      next: () => {
        this.snackBar.open($localize`Tag updated`);
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
