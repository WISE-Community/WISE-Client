import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../Node';

@Component({
  styleUrls: ['step-tools.component.scss'],
  templateUrl: 'step-tools.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StepToolsComponent {
  @Input()
  onlyShowStepsWithWork: boolean = false;

  icons: any;
  nextId: any;
  node: Node;
  nodeIds: string[];
  nodeId: string;
  prevId: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    private dir: Directionality,
    private NodeService: NodeService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.calculateNodeIds();
    this.updateModel();
    if (this.dir.value === 'rtl') {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    } else {
      this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    }
    this.subscriptions.add(
      this.TeacherDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.ProjectService.projectChanged$.subscribe(() => {
        this.calculateNodeIds();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  calculateNodeIds() {
    this.nodeIds = Object.keys(this.ProjectService.idToOrder);
    if (this.onlyShowStepsWithWork) {
      this.nodeIds = this.nodeIds.filter((nodeId) => {
        return this.isGroupNode(nodeId) || this.ProjectService.nodeHasWork(nodeId);
      });
    }
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  nodeChanged() {
    this.TeacherDataService.setCurrentNodeByNodeId(this.nodeId);
  }

  updateModel() {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.node = this.ProjectService.getNode(this.nodeId);
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
