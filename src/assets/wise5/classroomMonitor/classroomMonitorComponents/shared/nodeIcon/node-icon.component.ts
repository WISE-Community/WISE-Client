'use strict';

import { ProjectService } from '../../../../services/projectService';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'node-icon',
  templateUrl: 'node-icon.component.html',
  styleUrls: ['node-icon.component.scss']
})
export class NodeIconComponent {
  @Input()
  customClass: string;

  @Input()
  icon: any;

  isGroup: boolean;

  @Input()
  nodeId: string;

  @Input()
  size: any;

  sizeClass: any;

  constructor(private ProjectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
    if (changes.icon == null) {
      this.icon = this.ProjectService.getNode(this.nodeId).getIcon();
    }
    if (this.size) {
      this.sizeClass = `mat-${this.size}`;
    }
  }

  isFont() {
    return this.icon.type === 'font';
  }

  isImage() {
    return this.icon.type === 'img';
  }
}
