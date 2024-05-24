'use strict';

import { ProjectService } from '../../services/projectService';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Node } from '../../common/Node';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'node-icon',
  standalone: true,
  styleUrl: 'node-icon.component.scss',
  templateUrl: 'node-icon.component.html'
})
export class NodeIconComponent {
  @Input() canEdit: boolean;
  @Input() customClass: string;
  @Input() icon: any;
  protected isGroup: boolean;
  protected node: Node;
  @Input() nodeId: string;
  @Input() size: number;
  protected sizeClass: string;

  constructor(protected dialog: MatDialog, protected projectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.node = this.projectService.getNode(this.nodeId);
    this.isGroup = this.node.isGroup();
    if (changes.icon == null) {
      this.icon = this.projectService.getNode(this.nodeId).getIcon();
    }
    if (this.size) {
      this.sizeClass = `mat-${this.size}`;
    }
  }

  protected isFont(): boolean {
    return this.icon.type === 'font';
  }

  protected isImage(): boolean {
    return this.icon.type === 'img';
  }
}
