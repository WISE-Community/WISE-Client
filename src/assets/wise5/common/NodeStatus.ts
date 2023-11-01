import { ComponentStatus } from './ComponentStatus';
import { NodeProgress } from './NodeProgress';

export class NodeStatus {
  componentStatuses: { [componentId: string]: ComponentStatus };
  isCompleted: boolean;
  isVisible: boolean;
  isVisitable: boolean;
  isVisited: boolean;
  nodeId: string;
  progress?: NodeProgress;

  constructor(nodeId: string) {
    this.isCompleted = true;
    this.isVisible = true;
    this.isVisitable = true;
    this.nodeId = nodeId;
  }
}
