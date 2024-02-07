import { Component, Input, Signal } from '@angular/core';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';

@Component({
  selector: 'project-authoring',
  templateUrl: './project-authoring.component.html',
  styleUrls: ['./project-authoring.component.scss']
})
export class ProjectAuthoringComponent {
  protected inactiveGroupNodes: any[];
  private inactiveNodes: any[];
  protected inactiveStepNodes: any[];
  protected items: any;
  protected lessons: any[] = [];
  protected nodeIdToChecked: any = {};
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input('unitId') protected projectId?: number;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private deleteNodeService: DeleteNodeService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.projectId);
    this.refreshProject();
    this.dataService.setCurrentNode(null);
    this.temporarilyHighlightNewNodes(history.state.newNodes);
    this.nodeTypeSelected = this.projectService.getNodeTypeSelected();
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
    this.items.shift(); // remove the 'group0' master root node from consideration
    this.lessons = this.projectService.getOrderedGroupNodes();
    this.inactiveGroupNodes = this.projectService.getInactiveGroupNodes();
    this.inactiveStepNodes = this.projectService.getInactiveStepNodes();
    this.inactiveNodes = this.projectService.getInactiveNodes();
    this.unselectAllItems();
  }

  protected nodeClicked(nodeId: string): void {
    this.unselectAllItems();
    this.dataService.setCurrentNodeByNodeId(nodeId);
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
      if (this.nodeIdToChecked[item.id]) {
        selectedNodeIds.push(item.id);
      }
    });
    for (const inactiveNode of this.inactiveNodes) {
      if (this.nodeIdToChecked[inactiveNode.id]) {
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
    this.projectService.setNodeTypeSelected(null);
  }

  protected addNewLesson(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-lesson`]);
  }

  protected addNewStep(): void {
    this.router.navigate([`/teacher/edit/unit/${this.projectId}/add-node/choose-template`]);
  }

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

  protected getParentGroup(nodeId: string): any {
    return this.projectService.getParentGroup(nodeId);
  }

  /**
   * The checkbox for a node was clicked. We do not allow selecting a mix of group and step nodes.
   * If any group nodes are selected, disable all step node checkboxes, and vise-versa.
   */
  protected selectNode({ id, checked }: SelectNodeEvent): void {
    this.nodeIdToChecked[id] = checked;
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
