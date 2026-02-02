import { TeacherProjectService } from '../../services/teacherProjectService';
import { Component, inject } from '@angular/core';
import { TranslatableRichTextEditorComponent } from '../components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  imports: [TranslatableRichTextEditorComponent],
  selector: 'rubric-authoring',
  styles: ['.mat-icon { margin: 0px; }'],
  template: `<h5 i18n>Edit Unit Rubric</h5>
    <translatable-rich-text-editor
      [content]="project"
      key="rubric"
      (defaultLanguageTextChanged)="rubricChanged()"
    /> `
})
export class RubricAuthoringComponent {
  private projectService = inject(TeacherProjectService);

  protected project: any;

  ngOnInit(): void {
    this.project = this.projectService.getProject();
  }

  protected rubricChanged(): void {
    this.projectService.saveProject();
  }
}
