import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { ChooseNodeLocationComponent } from '../choose-node-location.component';

@Component({
  templateUrl: 'choose-copy-node-location.component.html',
  styleUrls: ['../choose-node-location.component.scss']
})
export class ChooseCopyNodeLocationComponent extends ChooseNodeLocationComponent {
  constructor(
    private copyNodesService: CopyNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(projectService, route, router);
  }

  protected insertAfter(nodeId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(this.copyNodesService.copyNodesAfter(this.selectedNodeIds, nodeId));
    });
  }

  protected insertInside(groupNodeId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(this.copyNodesService.copyNodesInsideGroup(this.selectedNodeIds, groupNodeId));
    });
  }
}
