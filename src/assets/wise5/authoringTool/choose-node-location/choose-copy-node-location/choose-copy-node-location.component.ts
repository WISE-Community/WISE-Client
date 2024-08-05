import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { ChooseNodeLocationComponent } from '../choose-node-location.component';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';

@Component({
  templateUrl: 'choose-copy-node-location.component.html',
  styleUrls: ['../choose-node-location.component.scss']
})
export class ChooseCopyNodeLocationComponent extends ChooseNodeLocationComponent {
  constructor(
    private copyNodesService: CopyNodesService,
    private copyTranslationsService: CopyTranslationsService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(projectService, route, router);
  }

  protected insertAfter(nodeId: string): any[] {
    const newNodes = this.copyNodesService.copyNodesAfter(this.selectedNodeIds, nodeId);
    this.copyTranslationsService.tryCopyNodes(newNodes);
    return newNodes;
  }

  protected insertInside(groupNodeId: string): any[] {
    const newNodes = this.copyNodesService.copyNodesInsideGroup(this.selectedNodeIds, groupNodeId);
    this.copyTranslationsService.tryCopyNodes(newNodes);
    return newNodes;
  }
}
