import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-component-header',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label i18n>Activity Title</mat-label>
      <input matInput [(ngModel)]="componentContent.title" (ngModelChange)="titleChanged()" />
    </mat-form-field>
  `
})
export class EditComponentHeaderComponent {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  titleChanged(): void {
    this.projectService.saveProject();
  }
}
