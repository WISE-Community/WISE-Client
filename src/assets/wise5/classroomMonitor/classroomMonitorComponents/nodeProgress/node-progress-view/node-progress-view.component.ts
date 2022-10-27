import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { Subscription } from 'rxjs';
import { UpgradeModule } from '@angular/upgrade/static';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithOpenInNewWindowComponent } from '../../../../directives/dialog-with-open-in-new-window/dialog-with-open-in-new-window.component';

@Component({
  selector: 'node-progress-view',
  templateUrl: './node-progress-view.component.html',
  styleUrls: ['./node-progress-view.component.scss']
})
export class NodeProgressViewComponent implements OnInit {
  currentGroup: any;
  currentGroupId: string;
  currentWorkgroup: any;
  items: any;
  maxScore: any;
  nodeId: string;
  nodeIdToExpanded: any = {};
  rootNode: any;
  showRubricButton: boolean;
  subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.items = this.projectService.idToOrder;
    this.maxScore = this.projectService.getMaxScore();
    let stateParamNodeId = null;

    const stateParams = this.upgrade.$injector.get('$stateParams');
    if (stateParams != null) {
      stateParamNodeId = stateParams.nodeId;
    }

    if (stateParamNodeId != null && stateParamNodeId !== '') {
      this.nodeId = stateParamNodeId;
    }

    if (this.nodeId == null || this.nodeId === '') {
      this.nodeId = this.projectService.rootNode.id;
    }

    this.teacherDataService.setCurrentNodeByNodeId(this.nodeId);
    let startNodeId = this.projectService.getStartNodeId();
    this.rootNode = this.projectService.getRootNode(startNodeId);
    this.currentGroup = this.rootNode;
    if (this.currentGroup != null) {
      this.currentGroupId = this.currentGroup.id;
    }
    this.showRubricButton = false;
    if (this.projectHasRubric()) {
      this.showRubricButton = true;
    }

    this.subscriptions.add(
      this.teacherDataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        this.nodeId = currentNode.id;
        this.teacherDataService.setCurrentNode(currentNode);
        if (this.isGroupNode(this.nodeId)) {
          this.currentGroup = currentNode;
          this.currentGroupId = this.currentGroup.id;
        }
        this.upgrade.$injector.get('$state').go('root.cm.unit.node', { nodeId: this.nodeId });
      })
    );

    this.subscriptions.add(
      this.teacherDataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        this.currentWorkgroup = currentWorkgroup;
      })
    );

    this.upgrade.$injector.get('$transitions').onSuccess({}, ($transition) => {
      const toNodeId = $transition.params('to').nodeId;
      const fromNodeId = $transition.params('from').nodeId;
      if (toNodeId && fromNodeId && toNodeId !== fromNodeId) {
        this.nodeId = toNodeId;
        this.teacherDataService.endCurrentNodeAndSetCurrentNodeByNodeId(toNodeId);
      }

      if ($transition.name === 'root.cm.unit.node') {
        if (this.projectService.isApplicationNode(toNodeId)) {
          document.getElementById('content').scrollTop = 0;
        }
      }
    });
    if (!this.isShowingNodeGradingView()) {
      this.saveNodeProgressViewDisplayedEvent();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private isShowingNodeGradingView(): boolean {
    return this.isApplicationNode(this.nodeId);
  }

  private saveNodeProgressViewDisplayedEvent(): void {
    const context = 'ClassroomMonitor',
      nodeId = this.nodeId,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'nodeProgressViewDisplayed',
      data = { nodeId: this.nodeId };
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  isApplicationNode(nodeId: string): boolean {
    return this.projectService.isApplicationNode(nodeId);
  }

  private projectHasRubric(): boolean {
    var projectRubric = this.projectService.getProjectRubric();
    if (projectRubric != null && projectRubric != '') {
      return true;
    }
    return false;
  }

  showRubric(): void {
    this.dialog.open(DialogWithOpenInNewWindowComponent, {
      data: {
        content: this.projectService.replaceAssetPaths(this.projectService.getProjectRubric()),
        scroll: true,
        title: this.projectService.getProjectTitle()
      },
      panelClass: 'dialog-lg'
    });
  }

  childExpandedEvent({ nodeId, expanded }): void {
    for (const key of Object.keys(this.nodeIdToExpanded)) {
      this.nodeIdToExpanded[key] = false;
    }
    this.nodeIdToExpanded[nodeId] = expanded;
  }
}
