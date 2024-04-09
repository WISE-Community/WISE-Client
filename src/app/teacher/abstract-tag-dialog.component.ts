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
import { Subject, Subscription } from 'rxjs';

@Directive()
export abstract class AbstractTagDialogComponent implements OnInit {
  protected inputChanged: Subject<any> = new Subject<any>();
  protected subscriptions: Subscription = new Subscription();
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
    this.subscribeToInputChanged();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToInputChanged(): void {
    this.subscriptions.add(
      this.inputChanged.subscribe(({ tag }: any) => {
        if (this.doesTagAlreadyExist(this.tags, tag.text)) {
          this.snackBar.open($localize`Tag already exists`);
        }
      })
    );
  }

  private doesTagAlreadyExist(tags: Tag[], tagText: string): boolean {
    return tags.some((tag: Tag) => tag.text.toLowerCase() === tagText.toLowerCase().trim());
  }

  private createUniqueTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.tags != null && this.doesTagAlreadyExist(this.tags, control.value)
        ? { tagAlreadyExists: true }
        : null;
    };
  }

  protected keyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enterKeyAction();
    }
  }

  protected abstract enterKeyAction(): void;
}
