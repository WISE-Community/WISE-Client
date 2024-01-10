export class ReferenceComponent {
  componentId: string;
  nodeId: string;

  constructor(nodeId: string, componentId: string) {
    this.nodeId = nodeId;
    this.componentId = componentId;
  }
}
