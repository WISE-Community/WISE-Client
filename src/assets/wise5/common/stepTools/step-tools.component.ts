import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  styleUrls: ['step-tools.component.scss'],
  templateUrl: 'step-tools.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StepToolsComponent {
  is_rtl: boolean;
  icons: any;
  nextId: any;
  nodeIds: string[];
  nodeId: string;
  prevId: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    private NodeService: NodeService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.calculateNodeIds();
    this.updateModel();
    this.is_rtl = $('html').attr('dir') === 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.subscriptions.add(
      this.TeacherDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  calculateNodeIds() {
    this.nodeIds = Object.keys(this.ProjectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  nodeChanged() {
    this.TeacherDataService.setCurrentNodeByNodeId(this.nodeId);
  }

  updateModel() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    if (this.nodeId == null) {
      this.prevId = null;
      this.nextId = null;
    } else {
      if (!this.ProjectService.isGroupNode(this.nodeId)) {
        this.prevId = this.NodeService.getPrevNodeId(this.nodeId);
        this.NodeService.getNextNodeId(this.nodeId).then((currentNodeId) => {
          this.nextId = currentNodeId;
        });
      }
    }
  }

  getNodePositionAndTitleByNodeId(nodeId: string) {
    return this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
  }

  isGroupNode(nodeId: string) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  goToPrevNode() {
    this.NodeService.goToPrevNode();
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
  }

  goToNextNode() {
    this.NodeService.goToNextNode().then((nodeId: string) => {
      this.nodeId = nodeId;
    });
  }
}
