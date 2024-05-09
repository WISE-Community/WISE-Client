import { Component, Input } from '@angular/core';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'node-status-icon',
  standalone: true,
  styleUrl: 'node-status-icon.component.scss',
  templateUrl: 'node-status-icon.component.html'
})
export class NodeStatusIconComponent {
  @Input() nodeId: string;
  protected nodeStatus: any;

  constructor(private nodeStatusService: NodeStatusService) {}

  ngOnChanges(): void {
    this.nodeStatus = this.nodeStatusService.getNodeStatusByNodeId(this.nodeId);
  }
}
