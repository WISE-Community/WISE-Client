import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { TranslatableRichTextEditorComponent } from '../../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [TranslatableRichTextEditorComponent],
  selector: 'edit-component-rubric',
  styles: `
    translatable-rich-text-editor .mat-mdc-tab-body-content {
      padding: 0 !important;
    }
  `,
  template: `<translatable-rich-text-editor
    class="translatable-rich-text-full-height"
    [content]="componentContent"
    key="rubric"
    (defaultLanguageTextChanged)="save()"
  />`
})
export class EditComponentRubricComponent {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  protected save(): void {
    this.projectService.saveProject();
  }
}
