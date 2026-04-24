import { Component, inject, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslatableRichTextEditorComponent } from '../../components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  imports: [TranslatableRichTextEditorComponent],
  selector: 'edit-node-rubric',
  template: `<translatable-rich-text-editor
    [content]="node"
    key="rubric"
    (defaultLanguageTextChanged)="saveProject()"
  />`
})
export class EditNodeRubricComponent {
  private projectService = inject(TeacherProjectService);

  @Input() node: any;

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
