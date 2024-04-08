import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { Tag } from '../../domain/tag';

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
export class CreateTagDialogComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  protected tagControl = new FormControl('', [
    Validators.required,
    this.createUniqueTagValidator()
  ]);
  private tags: Tag[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private snackBar: MatSnackBar,
    private projectTagService: ProjectTagService
  ) {}

  ngOnInit(): void {
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
    this.subscriptions.add(
      this.projectTagService.newTag$.subscribe(() => {
        this.snackBar.open($localize`Tag created`);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createUniqueTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.tags != null &&
        this.projectTagService.doesTagAlreadyExist(this.tags, control.value)
        ? { tagAlreadyExists: true }
        : null;
    };
  }

  protected keyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.create();
    }
  }

  protected create(): void {
    this.projectTagService.createTag(this.tagControl.value.trim()).subscribe({
      next: (tag: Tag) => {
        this.projectTagService.emitNewTag(tag);
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
