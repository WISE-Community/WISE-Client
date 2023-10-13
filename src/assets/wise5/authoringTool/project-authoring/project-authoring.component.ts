import { Component } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'project-authoring',
  templateUrl: './project-authoring.component.html',
  styleUrls: ['./project-authoring.component.scss']
})
export class ProjectAuthoringComponent {
  protected groupNodeSelected: boolean = false;
  private idToNode: any;
  protected inactiveGroupNodes: any[];
  private inactiveNodes: any[];
  protected inactiveStepNodes: any[];
  protected items: any;
  protected projectId: number;
  protected stepNodeSelected: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private deleteNodeService: DeleteNodeService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('unitId'));
    this.refreshProject();
    this.dataService.setCurrentNode(null);
    this.temporarilyHighlightNewNodes(history.state.newNodes);
    this.subscriptions.add(
      this.projectService.refreshProject$.subscribe(() => {
        this.refreshProject();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private refreshProject(): void {
    this.projectService.parseProject();
    this.items = this.projectService.getNodesInOrder();
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.inactiveNodes = this.projectService.getInactiveNodes();
    this.idToNode = this.projectService.getIdToNode();
    this.unselectAllItems();
  }

  protected previewProject(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected nodeClicked(nodeId: string): void {
    this.unselectAllItems();
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }

  protected constraintIconClicked(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
    this.router.navigate([
      `/teacher/edit/unit/${this.projectId}/node/${nodeId}/advanced/constraint`
    ]);
  }

  protected branchIconClicked(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/node/${nodeId}/advanced/path`]);
  }

  protected chooseLocation(isCopy: boolean): void {
    this.router.navigate([isCopy ? 'choose-copy-location' : 'choose-move-location'], {
      relativeTo: this.route,
      state: { selectedNodeIds: this.getSelectedNodeIds() }
    });
  }

  protected deleteSelectedNodes(): void {
    const selectedNodeIds = this.getSelectedNodeIds();
    const confirmMessage =
      selectedNodeIds.length === 1
        ? $localize`Are you sure you want to delete the selected item?`
        : $localize`Are you sure you want to delete the ${selectedNodeIds.length} selected items?`;
    if (confirm(confirmMessage)) {
      selectedNodeIds.forEach((nodeId) => this.deleteNodeService.deleteNode(nodeId));
      this.projectService.saveProject();
      this.refreshProject();
    }
  }

  private getSelectedNodeIds(): string[] {
    const selectedNodeIds = [];
    this.items.forEach((item: any) => {
      if (item.checked) {
        selectedNodeIds.push(item.key);
      }
    });
    for (const inactiveNode of this.inactiveNodes) {
      if (inactiveNode.checked) {
        selectedNodeIds.push(inactiveNode.id);
      }
    }
    return selectedNodeIds;
  }

  private unselectAllItems(): void {
    this.items.forEach((item: any) => {
      item.checked = false;
    });
    this.inactiveGroupNodes.forEach((inactiveGroupNode: any) => {
      inactiveGroupNode.checked = false;
    });
    this.inactiveStepNodes.forEach((inactiveStepNode: any) => {
      inactiveStepNode.checked = false;
    });
    this.stepNodeSelected = false;
    this.groupNodeSelected = false;
  }

  protected addNewLesson(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-lesson/configure`]);
  }

  protected addNewStep(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-node/choose-template`]);
  }

  protected addStructure(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/structure/choose`]);
  }

  protected goToAdvancedAuthoring(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/advanced`]);
  }

  protected isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }

  protected goBackToProjectList(): void {
    this.router.navigate([`/teacher/edit/home`]);
  }

  /**
   * Temporarily highlight the new nodes to draw attention to them
   * @param newNodes the new nodes to highlight
   */
  private temporarilyHighlightNewNodes(newNodes = []): void {
    if (newNodes.length > 0) {
      setTimeout(() => {
        newNodes.forEach((newNode) => temporarilyHighlightElement(newNode.id));
        const firstNodeElementAdded = $('#' + newNodes[0].id);
        $('#content').animate(
          {
            scrollTop: firstNodeElementAdded.prop('offsetTop') - 60
          },
          1000
        );
      });
    }
  }

  protected getStepBackgroundColor(nodeId: string): string {
    return this.projectService.getBackgroundColor(nodeId);
  }

  protected getNumberOfInactiveGroups(): number {
    return this.inactiveNodes.filter((node) => node.type === 'group').length;
  }

  /**
   * Get the number of inactive steps. This only counts the inactive steps that
   * are not in an inactive group.
   * @return The number of inactive steps (not including the inactive steps that
   * are in an inactive group).
   */
  protected getNumberOfInactiveSteps(): number {
    return this.inactiveNodes.filter(
      (node) => node.type === 'node' && this.projectService.getParentGroup(node.id) == null
    ).length;
  }

  protected getParentGroup(nodeId: string): any {
    return this.projectService.getParentGroup(nodeId);
  }

  /**
   * The checkbox for a node was clicked. We do not allow selecting a mix of group and step nodes.
   * If any group nodes are selected, disable all step node checkboxes, and vise-versa.
   */
  protected selectNode(): void {
    const checkedNodes = this.items
      .concat(Object.values(this.idToNode))
      .filter((item) => item.checked);
    if (checkedNodes.length === 0) {
      this.groupNodeSelected = false;
      this.stepNodeSelected = false;
    } else {
      this.groupNodeSelected = this.isGroupNode(checkedNodes[0].id);
      this.stepNodeSelected = !this.groupNodeSelected;
    }
  }

  protected isBranchPoint(nodeId: string): boolean {
    return this.projectService.isBranchPoint(nodeId);
  }

  protected getNumberOfBranchPaths(nodeId: string): number {
    return this.projectService.getNumberOfBranchPaths(nodeId);
  }

  protected getBranchCriteriaDescription(nodeId: string): string {
    return this.projectService.getBranchCriteriaDescription(nodeId);
  }

  protected nodeHasConstraint(nodeId: string): boolean {
    return this.projectService.nodeHasConstraint(nodeId);
  }

  protected getNumberOfConstraintsOnNode(nodeId: string): number {
    return this.projectService.getConstraintsOnNode(nodeId).length;
  }

  protected getConstraintDescriptions(nodeId: string): string {
    let constraintDescriptions = '';
    const constraints = this.projectService.getConstraintsOnNode(nodeId);
    for (let c = 0; c < constraints.length; c++) {
      let constraint = constraints[c];
      let description = this.projectService.getConstraintDescription(constraint);
      constraintDescriptions += c + 1 + ' - ' + description + '\n';
    }
    return constraintDescriptions;
  }

  protected nodeHasRubric(nodeId: string): boolean {
    return this.projectService.nodeHasRubric(nodeId);
  }

  protected hasSelectedNodes(): boolean {
    return this.getSelectedNodeIds().length > 0;
  }

  protected hasSelectedStepsOnly(): boolean {
    return (
      this.hasSelectedNodes() &&
      this.getSelectedNodeIds().every((nodeId) => this.projectService.isApplicationNode(nodeId))
    );
  }
}
