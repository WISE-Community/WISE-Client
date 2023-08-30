import { Component } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import * as $ from 'jquery';
import { Subscription, filter } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'project-authoring',
  templateUrl: './project-authoring.component.html',
  styleUrls: ['./project-authoring.component.scss']
})
export class ProjectAuthoringComponent {
  protected activityNodeSelected: boolean = false;
  protected authors: string[] = [];
  private idToNode: any;
  protected inactiveGroupNodes: any[];
  private inactiveNodes: any[];
  protected inactiveStepNodes: any[];
  protected items: any;
  private projectId: number;
  protected showProjectView: boolean = true;
  private rxStomp: RxStomp;
  protected stepNodeSelected: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private deleteNodeService: DeleteNodeService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.updateShowProjectView();
        this.temporarilyHighlightNewNodes(history.state.newNodes);
      })
    );
  }

  ngOnInit(): void {
    this.updateShowProjectView();
    this.projectId = Number(this.route.snapshot.paramMap.get('unitId'));
    this.items = Object.entries(this.projectService.idToOrder)
      .map((entry: any) => {
        return { key: entry[0], order: entry[1].order };
      })
      .sort((a: any, b: any) => {
        return a.order - b.order;
      });
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.inactiveNodes = this.projectService.getInactiveNodes();
    this.idToNode = this.projectService.getIdToNode();
    this.subscribeToCurrentAuthors(this.projectId);
    this.subscriptions.add(
      this.projectService.refreshProject$.subscribe(() => {
        this.refreshProject();
      })
    );

    this.subscriptions.add(
      this.projectService.scrollToBottomOfPage$.subscribe(() => {
        this.scrollToBottomOfPage();
      })
    );

    window.onbeforeunload = (event) => {
      this.endProjectAuthoringSession();
    };
  }

  ngOnDestroy(): void {
    this.endProjectAuthoringSession();
    this.subscriptions.unsubscribe();
  }

  private updateShowProjectView(): void {
    this.showProjectView = /\/teacher\/edit\/unit\/(\d*)$/.test(this.router.url);
  }

  private endProjectAuthoringSession(): void {
    this.rxStomp.deactivate();
    this.projectService.notifyAuthorProjectEnd(this.projectId);
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
    let confirmMessage = '';
    if (selectedNodeIds.length === 1) {
      confirmMessage = $localize`Are you sure you want to delete the selected item?`;
    } else {
      confirmMessage = $localize`Are you sure you want to delete the ${selectedNodeIds.length} selected items?`;
    }
    if (confirm(confirmMessage)) {
      this.deleteNodesById(selectedNodeIds);
    }
  }

  private deleteNodesById(nodeIds: string[]): void {
    let deletedStartNodeId = false;
    const stepsDeleted = [];
    const activitiesDeleted = [];
    for (const nodeId of nodeIds) {
      const node = this.projectService.getNodeById(nodeId);
      const tempNode = {
        nodeId: node.id,
        title: this.projectService.getNodePositionAndTitle(node.id),
        stepsInActivityDeleted: []
      };
      if (this.projectService.isStartNodeId(nodeId)) {
        deletedStartNodeId = true;
      }
      if (this.projectService.isGroupNode(nodeId)) {
        const stepsInActivityDeleted = [];
        for (const stepNodeId of node.ids) {
          const stepObject = {
            nodeId: stepNodeId,
            title: this.projectService.getNodePositionAndTitle(stepNodeId)
          };
          stepsInActivityDeleted.push(stepObject);
        }
        tempNode.stepsInActivityDeleted = stepsInActivityDeleted;
        activitiesDeleted.push(tempNode);
      } else {
        stepsDeleted.push(tempNode);
      }
      this.deleteNodeService.deleteNode(nodeId);
    }
    if (deletedStartNodeId) {
      this.updateStartNodeId();
    }
    this.projectService.saveProject();
    this.refreshProject();
  }

  private getSelectedNodeIds(): string[] {
    const selectedNodeIds = [];
    this.items.forEach((item: any) => {
      if (item.checked) {
        selectedNodeIds.push(item.key);
      }
    });

    if (this.inactiveNodes != null) {
      for (const inactiveNode of this.inactiveNodes) {
        if (inactiveNode.checked) {
          selectedNodeIds.push(inactiveNode.id);
        }
      }
    }
    return selectedNodeIds;
  }

  /**
   * Get the distinct types of the selected items, both active and inactive.
   * @returns an array of item types. possible items are group or node.
   */
  private getSelectedItemTypes(): string[] {
    const selectedItemTypes = [];
    this.items.forEach((item: any) => {
      if (item.checked) {
        const node = this.projectService.getNodeById(item.key);
        if (node != null) {
          let nodeType = node.type;
          if (selectedItemTypes.indexOf(nodeType) == -1) {
            selectedItemTypes.push(nodeType);
          }
        }
      }
    });

    if (this.inactiveNodes != null) {
      for (let inactiveNode of this.inactiveNodes) {
        if (inactiveNode != null && inactiveNode.checked) {
          let inactiveNodeType = inactiveNode.type;
          if (selectedItemTypes.indexOf(inactiveNodeType) == -1) {
            selectedItemTypes.push(inactiveNodeType);
          }
        }
      }
    }
    return selectedItemTypes;
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
    this.activityNodeSelected = false;
  }

  protected createNewLesson(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-lesson/configure`]);
  }

  protected createNewStep(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-node/choose-template`]);
  }

  protected addStructure(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/structure/choose`]);
  }

  private updateStartNodeId(): void {
    let newStartNodeId = null;
    let startGroupId = this.projectService.getStartGroupId();
    let node = this.projectService.getNodeById(startGroupId);
    let done = false;

    // recursively traverse the start ids
    while (!done) {
      if (node == null) {
        // base case in case something went wrong
        done = true;
      } else if (this.projectService.isGroupNode(node.id)) {
        // the node is a group node so we will get its start node
        node = this.projectService.getNodeById(node.startId);
      } else if (this.projectService.isApplicationNode(node.id)) {
        // the node is a step node so we have found the new start node id
        newStartNodeId = node.id;
        done = true;
      } else {
        // base case in case something went wrong
        done = true;
      }
    }

    if (newStartNodeId) {
      this.projectService.setStartNodeId(newStartNodeId);
    }
  }

  private refreshProject(): void {
    this.projectService.parseProject();
    this.items = Object.entries(this.projectService.idToOrder)
      .map((entry: any) => {
        return { key: entry[0], order: entry[1].order };
      })
      .sort((a: any, b: any) => {
        return a.order - b.order;
      });
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.inactiveNodes = this.projectService.getInactiveNodes();
    this.idToNode = this.projectService.getIdToNode();
    this.unselectAllItems();
  }

  protected importStep(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/import-step/choose-step`]);
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

  private scrollToBottomOfPage(): void {
    $('#content').animate(
      {
        scrollTop: $('#bottom').prop('offsetTop')
      },
      1000
    );
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
    let count = 0;
    for (let n = 0; n < this.inactiveNodes.length; n++) {
      let inactiveNode = this.inactiveNodes[n];
      if (inactiveNode != null) {
        if (inactiveNode.type == 'group') {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Get the number of inactive steps. This only counts the inactive steps that
   * are not in an inactive group.
   * @return The number of inactive steps (not including the inactive steps that
   * are in an inactive group).
   */
  protected getNumberOfInactiveSteps(): number {
    let count = 0;
    for (let n = 0; n < this.inactiveNodes.length; n++) {
      let inactiveNode = this.inactiveNodes[n];
      if (inactiveNode != null) {
        if (
          inactiveNode.type == 'node' &&
          this.projectService.getParentGroup(inactiveNode.id) == null
        ) {
          count++;
        }
      }
    }
    return count;
  }

  protected getParentGroup(nodeId: string): any {
    return this.projectService.getParentGroup(nodeId);
  }

  /**
   * The checkbox for a node was clicked. We will determine whether there are
   * any activity nodes that are selected or whether there are any step nodes
   * that are selected. We do this because we do not allow selecting a mix of
   * activities and steps. If there are any activity nodes that are selected,
   * we will disable all the step node check boxes. Alternatively, if there are
   * any step nodes selected, we will disable all the activity node check boxes.
   * @param nodeId The node id of the node that was clicked.
   */
  protected projectItemClicked(): void {
    this.stepNodeSelected = false;
    this.activityNodeSelected = false;

    // this will check the items that are used in the project
    for (let item of this.items) {
      if (item.checked) {
        if (this.isGroupNode(item.key)) {
          this.activityNodeSelected = true;
        } else {
          this.stepNodeSelected = true;
        }
      }
    }

    // this will check the items that are unused in the project
    for (let key in this.idToNode) {
      let node = this.idToNode[key];
      if (node.checked) {
        if (this.isGroupNode(key)) {
          this.activityNodeSelected = true;
        } else {
          this.stepNodeSelected = true;
        }
      }
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

  private subscribeToCurrentAuthors(projectId: number): void {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: this.configService.getWebSocketURL()
    });
    this.rxStomp.activate();
    this.rxStomp.watch(`/topic/current-authors/${projectId}`).subscribe((message: Message) => {
      this.authors = JSON.parse(message.body);
    });
    this.rxStomp.connected$.subscribe(() => {
      this.projectService.notifyAuthorProjectBegin(this.projectId);
    });
  }
}
