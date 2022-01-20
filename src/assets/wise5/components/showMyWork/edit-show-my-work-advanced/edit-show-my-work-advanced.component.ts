import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-show-my-work-advanced',
  templateUrl: './edit-show-my-work-advanced.component.html',
  styleUrls: ['./edit-show-my-work-advanced.component.scss']
})
export class EditShowMyWorkAdvancedComponent extends EditAdvancedComponentComponent {
  constructor(
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected projectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
