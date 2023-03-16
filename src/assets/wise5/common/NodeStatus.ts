export class NodeStatus {
  isCompleted: boolean;
  isVisible: boolean;
  isVisitable: boolean;
  isVisited: boolean;
  nodeId: string;

  constructor(nodeId: string) {
    this.isCompleted = true;
    this.isVisible = true;
    this.isVisitable = true;
    this.nodeId = nodeId;
  }
}
