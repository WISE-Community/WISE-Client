import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentContent } from '../../../common/ComponentContent';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslatableInputComponent } from '../translatable-input/translatable-input.component';

@Component({
  imports: [FormsModule, TranslatableInputComponent],
  selector: 'edit-component-title',
  template: `
    <translatable-input
      [content]="componentContent"
      [hasClearButton]="true"
      key="title"
      label="Activity Title"
      i18n-label
      (defaultLanguageTextChanged)="titleChanged($event)"
    />
  `
})
export class EditComponentTitleComponent {
  @Input() componentContent: ComponentContent;
  private projectService = inject(TeacherProjectService);

  titleChanged(title: string): void {
    this.componentContent.title = title;
    this.projectService.saveProject();
  }
}
