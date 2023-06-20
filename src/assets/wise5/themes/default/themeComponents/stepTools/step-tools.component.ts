import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';

@Component({
  selector: 'step-tools',
  templateUrl: './step-tools.component.html',
  styleUrls: ['./step-tools.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.calculateNodeIds();
    this.nodeStatuses = this.nodeStatusService.getNodeStatuses();
    this.idToOrder = this.projectService.idToOrder;
    this.updateModel();
    this.subscribeToChanges();
  }

  subscribeToChanges(): void {
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.updateModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  toNodeIdChanged(): void {
    this.nodeService.setCurrentNode(this.toNodeId);
  }

  updateModel(): void {
    const nodeId = this.studentDataService.getCurrentNodeId();
    if (!this.projectService.isGroupNode(nodeId)) {
      this.nodeId = nodeId;
      this.nodeStatus = this.nodeStatuses[this.nodeId];
      this.prevId = this.nodeService.getPrevNodeId();
      this.nextId = null;
      this.nodeService.getNextNodeId().then((nodeId: string) => {
        this.nextId = nodeId;
      });
      this.toNodeId = this.nodeId;
    }
  }

  getTemplateUrl(): string {
    return this.projectService.getThemePath() + '/themeComponents/stepTools/stepTools.html';
  }

  getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  goToPrevNode(): void {
    this.nodeService.goToPrevNode();
  }

  goToNextNode(): void {
    this.nodeService.goToNextNode();
  }

  closeNode(): void {
    this.nodeService.closeNode();
  }
}
