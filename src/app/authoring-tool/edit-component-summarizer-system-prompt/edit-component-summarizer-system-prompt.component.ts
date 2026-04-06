import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  imports: [CdkTextareaAutosize, FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-summarizer-system-prompt',
  template: `<mat-form-field class="w-full">
    <mat-label i18n>Teacher Summary System Prompt</mat-label>
    <textarea
      matInput
      cdkTextareaAutosize
      [(ngModel)]="componentContent.ai.teacherSummarySystemPrompt"
      (ngModelChange)="inputChanged.next($event)"
    ></textarea>
  </mat-form-field> `
})
export class EditComponentSummarizerSystemPromptComponent extends EditComponentFieldComponent {}
