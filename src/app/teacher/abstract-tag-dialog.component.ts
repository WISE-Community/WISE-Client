import { Directive, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ProjectTagService } from '../../assets/wise5/services/projectTagService';
import { Tag } from '../domain/tag';

@Directive()
export abstract class AbstractTagDialogComponent implements OnInit {
  protected tags: Tag[] = [];
  protected tagControl = new FormControl('', [
    Validators.required,
    this.createUniqueTagValidator()
  ]);

  constructor(protected projectTagService: ProjectTagService) {}

  ngOnInit(): void {
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
  }

  private createUniqueTagValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.doesTagAlreadyExist(control.value) ? { tagAlreadyExists: true } : null;
    };
  }

  private doesTagAlreadyExist(tagText: string): boolean {
    return this.tags.some((tag: Tag) => tag.text.toLowerCase() === tagText.toLowerCase().trim());
  }
}
