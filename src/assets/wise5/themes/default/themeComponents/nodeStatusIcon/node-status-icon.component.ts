import { Component, Input } from '@angular/core';
import { NodeStatusService } from '../../../../services/nodeStatusService';

@Component({
  selector: 'node-status-icon',
  styleUrls: ['node-status-icon.component.scss'],
  templateUrl: 'node-status-icon.component.html'
})
export class NodeStatusIcon {
  @Input() nodeId: string;
  nodeStatus: any;

  constructor(private nodeStatusService: NodeStatusService) {}

  ngOnChanges() {
    this.nodeStatus = this.nodeStatusService.getNodeStatusByNodeId(this.nodeId);
  }
}
