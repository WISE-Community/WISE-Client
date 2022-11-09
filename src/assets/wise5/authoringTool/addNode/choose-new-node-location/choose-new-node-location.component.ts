import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  templateUrl: 'choose-new-node-location.component.html'
})
export class ChooseNewNodeLocation {
  nodeIds: string[];

  constructor(
    private upgrade: UpgradeModule,
    private TeacherDataService: TeacherDataService,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.nodeIds = Object.keys(this.ProjectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  addNode(nodeId: string) {
    const newNode = this.ProjectService.createNode(
      this.upgrade.$injector.get('$stateParams').title
    );
    if (this.isGroupNode(nodeId)) {
      this.ProjectService.createNodeInside(newNode, nodeId);
    } else {
      this.ProjectService.createNodeAfter(newNode, nodeId);
    }
    this.addInitialComponents(
      newNode.id,
      this.upgrade.$injector.get('$stateParams').initialComponents
    );
    this.save(newNode.id).then(() => {
      this.goToNode(newNode.id);
    });
  }

  addInitialComponents(nodeId: string, components: any[]) {
    for (const component of components.reverse()) {
      this.ProjectService.createComponent(nodeId, component.type);
    }
  }

  save(newNodeId: string) {
    return this.ProjectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.ProjectService.refreshProject();
      this.saveEvent('stepCreated', 'Authoring', {
        nodeId: newNodeId,
        title: this.ProjectService.getNodePositionAndTitle(newNodeId)
      });
    });
  }

  goToNode(nodeId: string) {
    this.upgrade.$injector.get('$state').go('root.at.project.node', { nodeId: nodeId });
  }

  isGroupNode(nodeId: string) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  getNodeTitle(nodeId: string): string {
    return this.ProjectService.getNodeTitle(nodeId);
  }

  getNodePositionById(nodeId: string) {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  isNodeInAnyBranchPath(nodeId: string) {
    return this.ProjectService.isNodeInAnyBranchPath(nodeId);
  }

  saveEvent(eventName: string, category: string, data: any): any {
    const context = 'AuthoringTool';
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    return this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      eventName,
      data
    ).then((result) => {
      return result;
    });
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
