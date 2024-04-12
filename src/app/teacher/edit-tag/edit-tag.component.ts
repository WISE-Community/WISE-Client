import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

@Component({
  selector: 'edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class EditTagComponent {
  @Input() colorControl: FormControl;
  @Input() nameControl: FormControl;
  @Input() tag: Tag;
  private tags: Tag[] = [];
  @Output() enterKeyEvent: EventEmitter<void> = new EventEmitter();

  constructor(private projectTagService: ProjectTagService) {}

  ngOnInit(): void {
    if (this.tag != null) {
      this.nameControl.setValue(this.tag.text);
      this.colorControl.setValue(this.tag.color);
    }
    this.nameControl.addValidators([
      Validators.required,
      this.createArchivedTagValidator(),
      this.createUniqueTagValidator()
    ]);
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
      if (this.tag != null) {
        this.tags = this.tags.filter((tag: Tag) => tag.id !== this.tag.id);
      }
    });
  }

  private createArchivedTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value?.toLowerCase() === 'archived' ? { archivedNotAllowed: true } : null;
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
      this.enterKeyEvent.emit();
    }
  }
}
