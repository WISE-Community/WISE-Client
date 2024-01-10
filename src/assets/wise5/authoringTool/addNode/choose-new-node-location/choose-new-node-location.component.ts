import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-new-node-location',
  templateUrl: 'choose-new-node-location.component.html',
  styleUrls: ['./choose-new-node-location.component.scss', '../../add-content.scss']
})
export class ChooseNewNodeLocation {
  protected nodeIds: string[];

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected addNode(nodeId: string): void {
    const newNode = this.projectService.createNode(history.state.title);
    if (this.isGroupNode(nodeId)) {
      this.projectService.createNodeInside(newNode, nodeId);
    } else {
      this.projectService.createNodeAfter(newNode, nodeId);
    }
    this.addInitialComponents(newNode.id, history.state.initialComponents);
    this.save().then(() => {
      this.goToNode(newNode);
    });
  }

  private addInitialComponents(nodeId: string, components: any[]): void {
    components
      .reverse()
      .forEach((component) => this.projectService.createComponent(nodeId, component.type));
  }

  private save(): any {
    return this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
    });
  }

  private goToNode(node: any): void {
    this.router.navigate(['../..'], {
      relativeTo: this.route,
      state: { newNodes: [node] }
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
}
