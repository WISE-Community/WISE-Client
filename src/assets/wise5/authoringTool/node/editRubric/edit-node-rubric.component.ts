import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';
import { TranslatableRichTextEditorComponent } from '../../components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  imports: [TranslatableRichTextEditorComponent],
  template: `<h5 i18n>Edit Step Rubric</h5>
    <translatable-rich-text-editor
      [content]="node"
      key="rubric"
      (defaultLanguageTextChanged)="saveProject()"
    />`
})
export class EditNodeRubricComponent implements OnInit {
  protected node: any;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent.parent.parent.params.subscribe((params) => {
      this.node = this.projectService.getNodeById(params.nodeId);
    });
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
