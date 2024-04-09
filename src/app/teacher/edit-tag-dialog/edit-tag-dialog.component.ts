import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractTagDialogComponent } from '../abstract-tag-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { Tag } from '../../domain/tag';

@Component({
  selector: 'edit-tag-dialog',
  templateUrl: './edit-tag-dialog.component.html',
  styleUrls: ['./edit-tag-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class EditTagDialogComponent extends AbstractTagDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    protected projectTagService: ProjectTagService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private tag: Tag
  ) {
    super(projectTagService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tagControl.setValue(this.tag.text);
  }

  protected enterKeyAction(): void {
    this.save();
  }

  protected save(): void {
    this.tag.text = this.tagControl.value.trim();
    this.projectTagService.updateTag(this.tag).subscribe({
      next: () => {
        this.snackBar.open($localize`Tag updated`);
        this.dialogRef.close();
      },
      error: ({ error }) => {
        if (error.messageCode === 'tagAlreadyExists') {
          this.tagControl.setErrors({ tagAlreadyExists: true });
        }
      }
    });
  }
}
