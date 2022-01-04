import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../../../services/nodeService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';

@Component({
  selector: 'step-tools',
  templateUrl: './step-tools.component.html',
  styleUrls: ['./step-tools.component.scss']
})
export class StepToolsComponent implements OnInit {
  icons: any;
  idToOrder: any;
  is_rtl: boolean;
  nextId: string;
  nodeId: string;
  nodeIds: string[];
  nodeStatus: any;
  nodeStatuses: any;
  prevId: string;
  subscriptions: Subscription = new Subscription();
  toNodeId: string;

  constructor(
    private NodeService: NodeService,
    private ProjectService: ProjectService,
    private StudentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.calculateNodeIds();
    this.nodeStatuses = this.StudentDataService.getNodeStatuses();
    this.idToOrder = this.ProjectService.idToOrder;
    this.updateModel();
    this.subscribeToChanges();
  }

  subscribeToChanges(): void {
    this.subscriptions.add(
      this.StudentDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.StudentDataService.nodeStatusesChanged$.subscribe(() => {
        this.updateModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.ProjectService.idToOrder);
    this.nodeIds = this.nodeIds.filter((nodeId) => {
      return this.isGroupNode(nodeId) || this.ProjectService.nodeHasWork(nodeId);
    });
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  toNodeIdChanged(): void {
    if (!this.ProjectService.isGroupNode(this.toNodeId)) {
      this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.toNodeId);
    }
  }

  updateModel(): void {
    const nodeId = this.StudentDataService.getCurrentNodeId();
    if (!this.ProjectService.isGroupNode(nodeId)) {
      this.nodeId = nodeId;
      this.nodeStatus = this.nodeStatuses[this.nodeId];
      this.prevId = this.NodeService.getPrevNodeId();
      this.nextId = null;
      this.NodeService.getNextNodeId().then((nodeId: string) => {
        this.nextId = nodeId;
      });
      this.toNodeId = this.nodeId;
    }
  }

  getTemplateUrl(): string {
    return this.ProjectService.getThemePath() + '/themeComponents/stepTools/stepTools.html';
  }

  getNodeTitleByNodeId(nodeId: string): boolean {
    return this.ProjectService.getNodeTitleByNodeId(nodeId);
  }

  getNodePositionById(nodeId: string): boolean {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  getNodePositionAndTitleByNodeId(nodeId: string): boolean {
    return this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
  }

  isGroupNode(nodeId: string): boolean {
    return this.ProjectService.isGroupNode(nodeId);
  }

  goToPrevNode(): void {
    this.NodeService.goToPrevNode();
  }

  goToNextNode(): void {
    this.NodeService.goToNextNode();
  }

  closeNode(): void {
    this.NodeService.closeNode();
  }
}
