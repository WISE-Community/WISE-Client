import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { AbstractTagDialogComponent } from '../abstract-tag-dialog.component';

@Component({
  selector: 'create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.scss'],
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
export class CreateTagDialogComponent extends AbstractTagDialogComponent {
  constructor(
    protected dialogRef: MatDialogRef<CreateTagDialogComponent>,
    protected projectTagService: ProjectTagService,
    protected snackBar: MatSnackBar
  ) {
    super(dialogRef, projectTagService, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected enterKeyAction(): void {
    this.create();
  }

  protected create(): void {
    this.projectTagService.createTag(this.tagControl.value.trim()).subscribe({
      next: () => {
        this.snackBar.open($localize`Tag created`);
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
