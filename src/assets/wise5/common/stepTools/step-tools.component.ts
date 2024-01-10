import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../Node';
import { ConfigService } from '../../services/configService';

@Component({
  selector: 'step-tools',
  styleUrls: ['step-tools.component.scss'],
  templateUrl: 'step-tools.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StepToolsComponent {
  @Input() showOnlyStepsWithWork: boolean = false;
  icons: any;
  nextId: any;
  node: Node;
  nodeIds: string[];
  nodeId: string;
  prevId: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
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
    if (this.showOnlyStepsWithWork) {
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
        this.prevId = this.getPrevNodeId();
        this.getNextNodeId().then((nextId) => {
          this.nextId = nextId;
        });
      }
    }
  }

  getPrevNodeId(): string {
    if (this.isClassroomMonitorMode()) {
      return this.NodeService.getPrevNodeIdWithWork(this.nodeId);
    } else {
      return this.NodeService.getPrevNodeId(this.nodeId);
    }
  }

  getNextNodeId(): Promise<any> {
    if (this.isClassroomMonitorMode()) {
      return Promise.resolve(this.NodeService.getNextNodeIdWithWork(this.nodeId));
    } else {
      return this.NodeService.getNextNodeId(this.nodeId);
    }
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.ProjectService.getNodePositionAndTitle(nodeId);
  }

  isGroupNode(nodeId: string) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  goToPrevNode() {
    if (this.isClassroomMonitorMode()) {
      this.NodeService.goToPrevNodeWithWork();
    } else {
      this.NodeService.goToPrevNode();
    }
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
  }

  goToNextNode() {
    if (this.isClassroomMonitorMode()) {
      this.NodeService.goToNextNodeWithWork().then((nodeId: string) => {
        this.nodeId = nodeId;
      });
    } else {
      this.NodeService.goToNextNode().then((nodeId: string) => {
        this.nodeId = nodeId;
      });
    }
  }

  isClassroomMonitorMode(): boolean {
    return this.configService.getMode() === 'classroomMonitor';
  }
}
