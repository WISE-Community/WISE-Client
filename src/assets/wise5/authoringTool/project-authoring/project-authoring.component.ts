import { Component } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { MoveNodesService } from '../../services/moveNodesService';
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
  private copyMode: boolean;
  private idToNode: any;
  protected inactiveGroupNodes: any[];
  private inactiveNodes: any[];
  protected inactiveStepNodes: any[];
  protected insertGroupMode: boolean;
  protected insertNodeMode: boolean;
  protected items: any;
  private moveMode: boolean;
  private projectId: number;
  protected showProjectView: boolean = true;
  private rxStomp: RxStomp;
  protected stepNodeSelected: boolean = false;
  private subscriptions: Subscription = new Subscription();

  /*
   * The colors for the branch path steps. The colors are from
   * http://colorbrewer2.org/
   * http://colorbrewer2.org/export/colorbrewer.js
   * The colors chosen are from the 'qualitative', 'Set2'.
   */
  stepBackgroundColors: string[] = [
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
    '#b3b3b3'
  ];

  constructor(
    private configService: ConfigService,
    private copyNodesService: CopyNodesService,
    private deleteNodeService: DeleteNodeService,
    private moveNodesService: MoveNodesService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateShowProjectView());
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
    this.stepNodeSelected = false;
    this.activityNodeSelected = false;
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

  protected insertInside(nodeId: string): void {
    // TODO check that we are inserting into a group
    if (this.moveMode) {
      this.handleMoveModeInsert(nodeId, 'inside');
    } else if (this.copyMode) {
      this.handleCopyModeInsert(nodeId, 'inside');
    }
  }

  protected insertAfter(nodeId: string): void {
    if (this.moveMode) {
      this.handleMoveModeInsert(nodeId, 'after');
    } else if (this.copyMode) {
      this.handleCopyModeInsert(nodeId, 'after');
    }
  }

  /**
   * Move a node and insert it in the specified location
   * @param nodeId insert the new node inside or after this node id
   * @param moveTo whether to insert 'inside' or 'after' the nodeId parameter
   */
  private handleMoveModeInsert(nodeId: string, moveTo: string): void {
    let selectedNodeIds = this.getSelectedNodeIds();
    if (selectedNodeIds != null && selectedNodeIds.indexOf(nodeId) != -1) {
      /*
       * the user is trying to insert the selected node ids after
       * itself so we will not allow that
       */
      if (selectedNodeIds.length == 1) {
        alert($localize`You are not allowed to insert the selected item after itself.`);
      } else if (selectedNodeIds.length > 1) {
        alert($localize`You are not allowed to insert the selected items after itself.`);
      }
    } else {
      let movedNodes = [];
      for (let selectedNodeId of selectedNodeIds) {
        let node = {
          nodeId: selectedNodeId,
          fromTitle: this.projectService.getNodePositionAndTitle(selectedNodeId)
        };
        movedNodes.push(node);
      }

      let newNodes = [];
      if (moveTo === 'inside') {
        newNodes = this.moveNodesService.moveNodesInsideGroup(selectedNodeIds, nodeId);
      } else if (moveTo === 'after') {
        newNodes = this.moveNodesService.moveNodesAfter(selectedNodeIds, nodeId);
      } else {
        // an unspecified moveTo was provided
        return;
      }

      this.moveMode = false;
      this.insertGroupMode = false;
      this.insertNodeMode = false;
      this.temporarilyHighlightNewNodes(newNodes);
      this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
        this.refreshProject();
        if (newNodes != null && newNodes.length > 0) {
          let firstNewNode = newNodes[0];
          if (firstNewNode != null && firstNewNode.id != null) {
            for (let n = 0; n < movedNodes.length; n++) {
              let node = movedNodes[n];
              let newNode = newNodes[n];
              if (node != null && newNode != null) {
                node.toTitle = this.projectService.getNodePositionAndTitle(newNode.id);
              }
            }
          }
        }
      });
    }
  }

  /**
   * Copy a node and insert it in the specified location
   * @param nodeId insert the new node inside or after this node id
   * @param moveTo whether to insert 'inside' or 'after' the nodeId parameter
   */
  private handleCopyModeInsert(nodeId: string, moveTo: string): void {
    let selectedNodeIds = this.getSelectedNodeIds();
    let newNodes = [];
    if (moveTo === 'inside') {
      const firstNode: any = this.copyNodesService.copyNodeInside(selectedNodeIds[0], nodeId);
      const otherNodes = this.copyNodesService.copyNodesAfter(
        selectedNodeIds.slice(1),
        firstNode.id
      );
      newNodes = [firstNode].concat(otherNodes);
    } else if (moveTo === 'after') {
      newNodes = this.copyNodesService.copyNodesAfter(selectedNodeIds, nodeId);
    } else {
      // an unspecified moveTo was provided
      return;
    }
    const copiedNodes: any[] = selectedNodeIds.map((selectedNodeId) => {
      return {
        fromNodeId: selectedNodeId,
        fromTitle: this.projectService.getNodePositionAndTitle(selectedNodeId)
      };
    });
    this.copyMode = false;
    this.insertGroupMode = false;
    this.insertNodeMode = false;
    this.temporarilyHighlightNewNodes(newNodes);
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.refreshProject();
      if (newNodes != null && newNodes.length > 0) {
        let firstNewNode = newNodes[0];
        if (firstNewNode != null && firstNewNode.id != null) {
          for (let n = 0; n < copiedNodes.length; n++) {
            let node = copiedNodes[n];
            let newNode = newNodes[n];
            if (node != null && newNode != null) {
              node.toNodeId = newNode.id;
              node.toTitle = this.projectService.getNodePositionAndTitle(newNode.id);
            }
          }
        }
      }
    });
  }

  protected copy(): void {
    // make sure there is at least one item selected
    let selectedNodeIds = this.getSelectedNodeIds();
    if (selectedNodeIds == null || selectedNodeIds.length == 0) {
      alert($localize`Please select an item to copy and then click the "Copy" button again.`);
    } else {
      let selectedItemTypes = this.getSelectedItemTypes();
      if (selectedItemTypes.length === 1 && selectedItemTypes[0] === 'node') {
        this.insertNodeMode = true;
        this.copyMode = true;
      } else if (selectedItemTypes.length === 1 && selectedItemTypes[0] === 'group') {
        alert($localize`You cannot copy lessons at this time.`);
      }
    }
  }

  protected move(): void {
    // make sure there is at least one item selected
    let selectedNodeIds = this.getSelectedNodeIds();
    if (selectedNodeIds == null || selectedNodeIds.length == 0) {
      alert($localize`Please select an item to move and then click the "Move" button again.`);
    } else {
      let selectedItemTypes = this.getSelectedItemTypes();
      if (selectedItemTypes.length === 1 && selectedItemTypes[0] === 'node') {
        this.insertNodeMode = true;
        this.moveMode = true;
      } else if (selectedItemTypes.length === 1 && selectedItemTypes[0] === 'group') {
        this.insertGroupMode = true;
        this.moveMode = true;
      }
    }
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

  protected cancelMove(): void {
    this.insertGroupMode = false;
    this.insertNodeMode = false;
    this.moveMode = false;
    this.copyMode = false;
    this.unselectAllItems();
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
   * @param doScrollToNewNodes if true, scroll to the first new node added
   * TODO: can we remove the null checks: ensure that newNodes is never null?
   */
  private temporarilyHighlightNewNodes(newNodes, doScrollToNewNodes = false): void {
    setTimeout(() => {
      if (newNodes != null && newNodes.length > 0) {
        for (let newNode of newNodes) {
          if (newNode != null) {
            temporarilyHighlightElement(newNode.id);
          }
        }
        if (doScrollToNewNodes) {
          let firstNodeElementAdded = $('#' + newNodes[0].id);
          if (firstNodeElementAdded != null) {
            $('#content').animate(
              {
                scrollTop: firstNodeElementAdded.prop('offsetTop') - 60
              },
              1000
            );
          }
        }
      }
    });
  }

  /**
   * Get the background color for a step
   * @param nodeId get the background color for a step in the project view
   * @return If the node is in a branch path it will return a color. If the
   * node is not in a branch path it will return null.
   */
  protected getStepBackgroundColor(nodeId: string): string {
    let color = null;
    let branchPathLetter = this.projectService.getBranchPathLetter(nodeId);
    if (branchPathLetter != null) {
      // get the ascii code for the letter. example A=65, B=66, C=67, etc.
      let letterASCIICode = branchPathLetter.charCodeAt(0);

      // get the branch path number A=0, B=1, C=2, etc.
      let branchPathNumber = letterASCIICode - 65;

      // get the color for the branch path number
      color = this.stepBackgroundColors[branchPathNumber];
    }
    return color;
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
