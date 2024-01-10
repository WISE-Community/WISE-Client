import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'edit-peer-chat-advanced',
  templateUrl: './edit-peer-chat-advanced-component.component.html',
  styleUrls: ['./edit-peer-chat-advanced-component.component.scss']
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
