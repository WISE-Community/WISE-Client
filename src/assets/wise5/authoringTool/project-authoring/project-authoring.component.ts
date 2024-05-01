import { Component, Input, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherDataService } from '../../services/teacherDataService';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { ExpandEvent } from '../domain/expand-event';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { ComponentContent } from '../../common/ComponentContent';

@Component({
  selector: 'project-authoring',
  templateUrl: './project-authoring.component.html',
  styleUrls: ['./project-authoring.component.scss']
})
export class ProjectAuthoringComponent implements OnInit {
  protected allLessonsCollapsed: Signal<boolean> = computed(() =>
    this.isAllLessonsExpandedValue(false)
  );
  protected allLessonsExpanded: Signal<boolean> = computed(() =>
    this.isAllLessonsExpandedValue(true)
  );
  protected inactiveGroupNodes: any[];
  private inactiveNodes: any[];
  protected inactiveStepNodes: any[];
  protected items: any;
  protected lessons: any[] = [];
  protected lessonIdToExpanded: WritableSignal<{ [key: string]: boolean }> = signal({});
  protected nodeIdToChecked: any = {};
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input('unitId') protected projectId?: number;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private deleteNodeService: DeleteNodeService,
    private deleteTranslationsService: DeleteTranslationsService,
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
    this.expandAllLessons();
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
    const confirmMessage = $localize`Are you sure you want to delete the ${selectedNodeIds.length} selected item(s)?`;
    if (confirm(confirmMessage)) {
      // get the components before they're removed by the following line
      const components = this.getComponents(selectedNodeIds);
      selectedNodeIds.forEach((nodeId) => this.deleteNodeService.deleteNode(nodeId));
      this.removeLessonIdToExpandedEntries(selectedNodeIds);
      this.projectService.saveProject();
      this.refreshProject();
      this.deleteTranslationsService.tryDeleteComponents(components);
    }
  }

  private getComponents(nodeIds: string[]): ComponentContent[] {
    return nodeIds.flatMap((nodeId: string) => {
      return this.projectService.isGroupNode(nodeId)
        ? this.projectService.getComponentsFromLesson(nodeId)
        : this.projectService.getComponentsFromStep(nodeId);
    });
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

  private removeLessonIdToExpandedEntries(nodeIds: string[]): void {
    this.lessonIdToExpanded.mutate((value) => {
      nodeIds.forEach((nodeId) => {
        delete value[nodeId];
      });
    });
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
    this.nodeIdToChecked = {};
    this.projectService.setNodeTypeSelected(null);
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
    this.updateNodeTypeSelected();
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

  private isAllLessonsExpandedValue(expanded: boolean): boolean {
    return (
      this.lessons.every((lesson) => this.lessonIdToExpanded()[lesson.id] === expanded) &&
      this.inactiveGroupNodes.every(
        (inactiveGroupNode) => this.lessonIdToExpanded()[inactiveGroupNode.id] === expanded
      )
    );
  }

  protected expandAllLessons(): void {
    this.setAllLessonsExpandedValue(true);
  }

  protected collapseAllLessons(): void {
    this.setAllLessonsExpandedValue(false);
    this.lessons.forEach((lesson) => this.unselectChildren(lesson));
    this.updateNodeTypeSelected();
  }

  private setAllLessonsExpandedValue(expanded: boolean): void {
    this.lessonIdToExpanded.mutate((value) => {
      for (const lesson of this.lessons) {
        value[lesson.id] = expanded;
      }
      for (const inactiveGroupNode of this.inactiveGroupNodes) {
        value[inactiveGroupNode.id] = expanded;
      }
    });
  }

  protected onExpandedChanged(event: ExpandEvent): void {
    this.lessonIdToExpanded.mutate((value) => {
      value[event.id] = event.expanded;
    });
    const lesson = this.lessons
      .concat(this.inactiveGroupNodes)
      .find((lesson: any) => lesson.id === event.id);
    this.unselectChildren(lesson);
    this.updateNodeTypeSelected();
  }

  private unselectChildren(lesson: any): void {
    lesson.ids.forEach((childId: string) => (this.nodeIdToChecked[childId] = false));
  }

  private updateNodeTypeSelected(): void {
    let nodeTypeSelected = null;
    Object.entries(this.nodeIdToChecked).forEach(([nodeId, checked]) => {
      if (checked) {
        nodeTypeSelected = this.projectService.isGroupNode(nodeId)
          ? NodeTypeSelected.lesson
          : NodeTypeSelected.step;
      }
    });
    this.projectService.setNodeTypeSelected(nodeTypeSelected);
  }
}
