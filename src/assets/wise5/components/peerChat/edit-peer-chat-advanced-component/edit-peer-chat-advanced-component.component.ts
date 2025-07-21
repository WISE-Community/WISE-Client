import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

@Component({
  selector: 'edit-peer-chat-advanced',
  imports: [EditComponentConstraintsComponent, EditComponentJsonComponent],
  template: `
    <edit-component-constraints [componentContent]="component.content" />
    <edit-component-json [component]="component" />
  `
})
export class EditPeerChatAdvancedComponentComponent extends EditAdvancedComponentComponent {
  constructor(
    protected nodeService: TeacherNodeService,
    protected notebookService: NotebookService,
    protected projectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, projectService);
  }
}
