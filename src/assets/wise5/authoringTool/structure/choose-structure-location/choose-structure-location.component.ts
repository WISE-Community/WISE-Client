import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'choose-structure-location',
  templateUrl: './choose-structure-location.component.html',
  styleUrls: ['./choose-structure-location.component.scss']
})
export class ChooseStructureLocationComponent {
  groupNodes: any;
  projectId: number;
  $state: any;
  structure: any;

  constructor(private projectService: TeacherProjectService, private upgrade: UpgradeModule) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    const stateParams = this.upgrade.$injector.get('$stateParams');
    this.projectId = stateParams.projectId;
    this.structure = this.injectUniqueIds(stateParams.structure);
    const groupNodesIdToOrder = this.projectService.getGroupNodesIdToOrder();
    this.groupNodes = Object.entries(groupNodesIdToOrder).map((entry: any) => {
      return { id: entry[0], order: entry[1].order };
    });
    this.groupNodes.sort((a: any, b: any) => {
      return a.order - b.order;
    });
  }

  protected insertAsFirstActivity(): void {
    this.addNodesToProject(this.structure.nodes);
    this.projectService.createNodeInside(
      this.structure.group,
      this.projectService.getStartGroupId()
    );
    this.saveAndGoBackToProjectHome();
  }

  protected insertAfterGroup(groupId: string): void {
    this.addNodesToProject(this.structure.nodes);
    this.projectService.createNodeAfter(this.structure.group, groupId);
    this.saveAndGoBackToProjectHome();
  }

  private addNodesToProject(nodes: any[]): void {
    for (const node of nodes) {
      this.projectService.setIdToNode(node.id, node);
      this.projectService.addNode(node);
      this.projectService.applicationNodes.push(node);
    }
  }

  private saveAndGoBackToProjectHome(): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.$state.go('root.at.project');
    });
  }

  private injectUniqueIds(structure: any): void {
    structure.group.id = this.projectService.getNextAvailableGroupId();
    const oldToNewIds = this.projectService.getOldToNewIds(structure.nodes);
    return this.projectService.replaceOldIds(structure, oldToNewIds);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected cancel(): void {
    this.$state.go('root.at.project');
  }
}
