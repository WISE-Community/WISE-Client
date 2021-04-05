import { Directive, Input } from '@angular/core';
import { NodeService } from '../services/nodeService';

@Directive()
export abstract class ComponentStudent {
  @Input()
  nodeId: string;

  @Input()
  componentContent: any;

  componentId: string;

  constructor(protected NodeService: NodeService) {}

  ngOnInit() {
    this.componentId = this.componentContent.id;
  }

  broadcastDoneRenderingComponent() {
    this.NodeService.broadcastDoneRenderingComponent({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }
}
