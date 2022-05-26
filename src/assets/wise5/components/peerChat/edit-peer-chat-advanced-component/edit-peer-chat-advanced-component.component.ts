import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'edit-peer-chat-advanced-component',
  templateUrl: './edit-peer-chat-advanced-component.component.html',
  styleUrls: ['./edit-peer-chat-advanced-component.component.scss']
})
export class EditPeerChatAdvancedComponentComponent extends EditAdvancedComponentComponent {
  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(NodeService, NotebookService, ProjectService);
  }
}
