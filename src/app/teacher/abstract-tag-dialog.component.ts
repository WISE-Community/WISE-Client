import { Directive, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../assets/wise5/services/projectTagService';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { Tag } from '../domain/tag';

@Directive()
export abstract class AbstractTagDialogComponent implements OnInit {
  protected tagControl = new FormControl('', [
    Validators.required,
    this.createUniqueTagValidator()
  ]);
  protected tags: Tag[] = [];

  constructor(
    protected dialogRef: MatDialogRef<CreateTagDialogComponent>,
    protected projectTagService: ProjectTagService,
    protected snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
  }

  private createUniqueTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.tags != null && this.doesTagAlreadyExist(this.tags, control.value)
        ? { tagAlreadyExists: true }
        : null;
    };
  }

  private doesTagAlreadyExist(tags: Tag[], tagText: string): boolean {
    return tags.some((tag: Tag) => tag.text.toLowerCase() === tagText.toLowerCase().trim());
  }

  protected keyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enterKeyAction();
    }
  }

  protected abstract enterKeyAction(): void;
}
