'use strict';

import { ProjectService } from '../../../../services/projectService';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeIconChooserDialog } from '../../../../common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { Node } from '../../../../common/Node';

@Component({
  selector: 'node-icon',
  templateUrl: 'node-icon.component.html',
  styleUrls: ['node-icon.component.scss']
})
export class NodeIconComponent {
  @Input()
  canEdit: boolean = false;

  @Input()
  customClass: string;

  @Input()
  icon: any;

  isGroup: boolean;

  @Input()
  nodeId: string;

  node: Node;

  @Input()
  size: any;

  sizeClass: any;

  constructor(public dialog: MatDialog, private ProjectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.node = this.ProjectService.getNode(this.nodeId);
    this.isGroup = this.node.isGroup();
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

  openNodeIconChooserDialog() {
    this.dialog.open(NodeIconChooserDialog, {
      data: { node: this.node },
      panelClass: 'mat-dialog--md'
    });
  }
}
