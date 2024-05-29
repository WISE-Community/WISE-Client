import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { Tag } from '../../domain/tag';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColorChooserComponent } from '../color-chooser/color-chooser.component';

@Component({
  imports: [
    ColorChooserComponent,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'edit-tag',
  standalone: true,
  styleUrl: './edit-tag.component.scss',
  templateUrl: './edit-tag.component.html'
})
export class EditTagComponent {
  @Output() closeEvent: EventEmitter<void> = new EventEmitter();
  @ViewChild('nameInput') nameInput: ElementRef;
  protected submitLabel: string = $localize`Create`;
  @Input() tag: Tag;
  private tags: Tag[] = [];

  protected colorControl = new FormControl('');
  protected nameControl = new FormControl('', [
    Validators.required,
    this.createArchivedTagValidator(),
    this.createUniqueTagValidator()
  ]);

  constructor(private projectTagService: ProjectTagService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.tag != null) {
      this.nameControl.setValue(this.tag.text);
      this.colorControl.setValue(this.tag.color);
      this.submitLabel = $localize`Save`;
    }
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
      if (this.tag != null) {
        this.tags = this.tags.filter((tag: Tag) => tag.id !== this.tag.id);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    });
  }

  private createArchivedTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value?.toLowerCase() === 'archived') {
        control.markAsTouched();
        return { archivedNotAllowed: true };
      } else {
        return null;
      }
    };
  }

  private createUniqueTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.doesTagAlreadyExist(control.value)) {
        control.markAsTouched();
        return { tagAlreadyExists: true };
      } else {
        return null;
      }
    };
  }
  private doesTagAlreadyExist(tagText: string): boolean {
    return this.tags.some((tag: Tag) => tag.text.toLowerCase() === tagText.toLowerCase().trim());
  }

  protected enterKeyPressed(): void {
    if (this.nameControl.valid) {
      this.submit();
    }
  }

  protected chooseColor(color: string): void {
    this.colorControl.setValue(color);
  }

  protected submit(): void {
    if (this.tag == null) {
      this.createTag();
    } else {
      this.updateTag();
    }
  }

  private getNameValue(): string {
    return this.nameControl.value.trim();
  }

  private getColorValue(): string {
    return this.colorControl.value.trim();
  }

  private createTag(): void {
    this.projectTagService.createTag(this.getNameValue(), this.getColorValue()).subscribe({
      next: () => {
        this.snackBar.open($localize`Tag created`);
        this.close();
      },
      error: ({ error }) => {
        this.handleError(error);
      }
    });
  }

  private updateTag(): void {
    this.tag.text = this.getNameValue();
    this.tag.color = this.getColorValue();
    this.projectTagService.updateTag(this.tag).subscribe({
      next: () => {
        this.snackBar.open($localize`Tag updated`);
        this.close();
      },
      error: ({ error }) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    if (error.messageCode === 'tagAlreadyExists') {
      this.nameControl.setErrors({ tagAlreadyExists: true });
    }
  }

  protected close(): void {
    this.closeEvent.emit();
  }
}
