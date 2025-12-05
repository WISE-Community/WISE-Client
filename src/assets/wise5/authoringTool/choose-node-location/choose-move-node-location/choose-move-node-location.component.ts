import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MoveNodesService } from '../../../services/moveNodesService';
import { ChooseNodeLocationComponent } from '../choose-node-location.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { InsertNodeInsideButtonComponent } from '../insert-node-inside-button/insert-node-inside-button.component';
import { NodeIconAndTitleComponent } from '../node-icon-and-title/node-icon-and-title.component';
import { InsertNodeAfterButtonComponent } from '../insert-node-after-button/insert-node-after-button.component';
import { NodeWithMoveAfterButtonComponent } from '../node-with-move-after-button/node-with-move-after-button.component';

@Component({
  imports: [
    CommonModule,
    InsertNodeAfterButtonComponent,
    InsertNodeInsideButtonComponent,
    MatButtonModule,
    NodeIconAndTitleComponent,
    NodeWithMoveAfterButtonComponent,
    RouterModule
  ],
  styleUrl: '../choose-node-location.component.scss',
  templateUrl: 'choose-move-node-location.component.html'
})
export class ChooseMoveNodeLocationComponent extends ChooseNodeLocationComponent {
  protected moveGroup: boolean;
  private moveNodesService = inject(MoveNodesService);

  ngOnInit(): void {
    super.ngOnInit();
    this.moveGroup = this.projectService.getNode(this.selectedNodeIds[0]).isGroup();
    if (this.moveGroup) {
      this.nodeIds = this.nodeIds.filter((nodeId) => this.projectService.isGroupNode(nodeId));
    }
  }

  protected canInsertAfter(nodeId: string): boolean {
    return !this.selectedNodeIds.includes(nodeId);
  }

  protected insertAfter(nodeId: string): any[] {
    return this.moveNodesService.moveNodesAfter(this.selectedNodeIds, nodeId);
  }

  protected insertInside(groupNodeId: string): any[] {
    return this.moveNodesService.moveNodesInsideGroup(this.selectedNodeIds, groupNodeId);
  }
}
