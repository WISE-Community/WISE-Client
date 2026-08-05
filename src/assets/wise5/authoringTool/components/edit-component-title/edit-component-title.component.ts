import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComponentContent } from '../../../common/ComponentContent';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-title',
  template: `
    <mat-form-field class="w-full">
      <mat-label i18n>Activity Title</mat-label>
      <input matInput [(ngModel)]="componentContent.title" (ngModelChange)="titleChanged()" />
    </mat-form-field>
  `
})
export class EditComponentTitleComponent {
  private projectService = inject(TeacherProjectService);

  @Input() componentContent: ComponentContent;
  private title: string = '';

  titleChanged(): void {
    this.projectService.saveProject();
  }
}
