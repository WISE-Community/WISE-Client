import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { ChooseNodeLocationComponent } from '../choose-node-location.component';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';
import { CommonModule } from '@angular/common';
import { InsertNodeAfterButtonComponent } from '../insert-node-after-button/insert-node-after-button.component';
import { InsertNodeInsideButtonComponent } from '../insert-node-inside-button/insert-node-inside-button.component';
import { NodeIconAndTitleComponent } from '../node-icon-and-title/node-icon-and-title.component';
import { NodeWithMoveAfterButtonComponent } from '../node-with-move-after-button/node-with-move-after-button.component';

@Component({
  imports: [
    CommonModule,
    InsertNodeAfterButtonComponent,
    InsertNodeInsideButtonComponent,
    MatButtonModule,
    NodeIconAndTitleComponent,
    NodeWithMoveAfterButtonComponent,
    RouterLink
  ],
  styleUrl: '../choose-node-location.component.scss',
  templateUrl: 'choose-copy-node-location.component.html'
})
export class ChooseCopyNodeLocationComponent extends ChooseNodeLocationComponent {
  constructor(
    private copyNodesService: CopyNodesService,
    private copyTranslationsService: CopyTranslationsService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(projectService, route, router);
  }

  protected insertAfter(nodeId: string): any[] {
    const newNodes = this.copyNodesService.copyNodesAfter(this.selectedNodeIds, nodeId);
    this.copyTranslationsService.tryCopyNodes(newNodes);
    return newNodes;
  }

  protected insertInside(groupNodeId: string): any[] {
    const newNodes = this.copyNodesService.copyNodesInsideGroup(this.selectedNodeIds, groupNodeId);
    this.copyTranslationsService.tryCopyNodes(newNodes);
    return newNodes;
  }
}
