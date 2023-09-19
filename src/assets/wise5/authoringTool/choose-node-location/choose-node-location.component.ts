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
  protected pathToProjectAuthoringView = '..';
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

  protected async insert(nodeId: string, after: boolean): Promise<void> {
    this.saveAndGoToProjectView(
      after ? await this.insertAfter(nodeId) : await this.insertInside(nodeId)
    );
  }

  protected abstract insertAfter(nodeId: string): Promise<any[]>;

  protected abstract insertInside(groupNodeId: string): Promise<any[]>;

  protected saveAndGoToProjectView(newNodes: any[]): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.router.navigate([this.pathToProjectAuthoringView], {
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
