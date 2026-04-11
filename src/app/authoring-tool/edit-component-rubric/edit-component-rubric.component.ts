import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { TranslatableRichTextEditorComponent } from '../../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  imports: [TranslatableRichTextEditorComponent],
  selector: 'edit-component-rubric',
  template: `<translatable-rich-text-editor
    [content]="componentContent"
    key="rubric"
    (defaultLanguageTextChanged)="save()"
  />`
})
export class EditComponentRubricComponent {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  protected save(): void {
    this.projectService.componentChanged();
  }
}
