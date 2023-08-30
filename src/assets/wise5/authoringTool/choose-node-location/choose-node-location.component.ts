import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Component } from '@angular/core';

@Component({
  template: ''
})
export abstract class ChooseNodeLocationComponent {
  protected inactiveGroupNodes: any[];
  protected inactiveStepNodes: any[];
  protected nodeIds: string[];
  protected selectedNodeIds: string[];

  constructor(
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit() {
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' root node from consideration
    this.selectedNodeIds = history.state.selectedNodeIds;
  }

  protected insert(nodeId: string, after: boolean): void {
    this.saveAndGoToProjectView(after ? this.insertAfter(nodeId) : this.insertInside(nodeId));
  }

  protected abstract insertAfter(nodeId: string): any[];

  protected abstract insertInside(groupNodeId: string): any[];

  protected saveAndGoToProjectView(newNodes: any[]): void {
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
