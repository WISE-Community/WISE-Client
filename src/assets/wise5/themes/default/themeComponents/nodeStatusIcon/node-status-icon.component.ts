import { Component, Input } from '@angular/core';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'node-status-icon',
  styles: ['.mat-icon { vertical-align: middle; }'],
  templateUrl: 'node-status-icon.component.html'
})
export class NodeStatusIconComponent {
  @Input() nodeId: string;
  @Input() customClass: string;
  protected nodeStatus: any;
  @Input() size: number;
  protected sizeClass: string;

  constructor(private nodeStatusService: NodeStatusService) {}

  ngOnChanges(): void {
    this.nodeStatus = this.nodeStatusService.getNodeStatusByNodeId(this.nodeId);
    if (this.size) {
      this.sizeClass = `mat-${this.size}`;
    }
  }
}
