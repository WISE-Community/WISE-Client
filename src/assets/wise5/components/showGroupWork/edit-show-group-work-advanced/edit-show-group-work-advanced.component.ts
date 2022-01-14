import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-show-group-work-advanced',
  templateUrl: './edit-show-group-work-advanced.component.html',
  styleUrls: ['./edit-show-group-work-advanced.component.scss']
})
export class EditShowGroupWorkAdvancedComponent extends EditAdvancedComponentComponent {
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
