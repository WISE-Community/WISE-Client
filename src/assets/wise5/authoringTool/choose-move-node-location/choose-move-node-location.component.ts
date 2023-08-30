import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MoveNodesService } from '../../services/moveNodesService';

@Component({
  templateUrl: 'choose-move-node-location.component.html',
  styleUrls: ['./choose-move-node-location.component.scss']
})
export class ChooseMoveNodeLocationComponent {
  protected inactiveGroupNodes: any[];
  protected inactiveStepNodes: any[];
  protected moveGroup: boolean;
  protected nodeIds: string[];
  private selectedNodeIds: string[];

  constructor(
    private moveNodesService: MoveNodesService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.selectedNodeIds = history.state.selectedNodeIds;
    this.moveGroup = this.projectService.getNode(this.selectedNodeIds[0]).isGroup();
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' root node from consideration
    if (this.moveGroup) {
      this.nodeIds = this.nodeIds.filter((nodeId) => this.projectService.isGroupNode(nodeId));
    }
  }

  protected canMove(nodeId: string): boolean {
    return !this.selectedNodeIds.includes(nodeId);
  }

  protected move(nodeId: string, after: boolean): void {
    this.saveAndGoToProjectView(
      after
        ? this.moveNodesService.moveNodesAfter(this.selectedNodeIds, nodeId)
        : this.moveNodesService.moveNodesInsideGroup(this.selectedNodeIds, nodeId)
    );
  }

  private saveAndGoToProjectView(newNodes: any[]): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.router.navigate(['..'], {
        relativeTo: this.route,
        state: { newNodes: newNodes }
      });
    });
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId: string): any {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }

  protected getParentGroup(nodeId: string): any {
    return this.projectService.getParentGroup(nodeId);
  }

  protected getBackgroundColor(nodeId: string): string {
    return this.projectService.getBackgroundColor(nodeId);
  }
}
