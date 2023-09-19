import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoveNodesService } from '../../../services/moveNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ChooseNodeLocationComponent } from '../choose-node-location.component';

@Component({
  templateUrl: 'choose-move-node-location.component.html',
  styleUrls: ['../choose-node-location.component.scss']
})
export class ChooseMoveNodeLocationComponent extends ChooseNodeLocationComponent {
  protected moveGroup: boolean;

  constructor(
    private moveNodesService: MoveNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(projectService, route, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.moveGroup = this.projectService.getNode(this.selectedNodeIds[0]).isGroup();
    if (this.moveGroup) {
      this.nodeIds = this.nodeIds.filter((nodeId) => this.projectService.isGroupNode(nodeId));
    }
  }

  protected canInsertAfter(nodeId: string): boolean {
    return !this.selectedNodeIds.includes(nodeId);
  }

  protected insertAfter(nodeId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(this.moveNodesService.moveNodesAfter(this.selectedNodeIds, nodeId));
    });
  }

  protected insertInside(groupNodeId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(this.moveNodesService.moveNodesInsideGroup(this.selectedNodeIds, groupNodeId));
    });
  }
}
