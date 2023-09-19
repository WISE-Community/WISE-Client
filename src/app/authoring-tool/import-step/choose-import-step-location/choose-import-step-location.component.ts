import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { CopyNodesService } from '../../../../assets/wise5/services/copyNodesService';
import { InsertNodesService } from '../../../../assets/wise5/services/insertNodesService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { ChooseNodeLocationComponent } from '../../../../assets/wise5/authoringTool/choose-node-location/choose-node-location.component';
import { lastValueFrom, map } from 'rxjs';

@Component({
  selector: 'choose-import-step-location',
  styleUrls: ['choose-import-step-location.component.scss'],
  templateUrl: 'choose-import-step-location.component.html'
})
export class ChooseImportStepLocationComponent extends ChooseNodeLocationComponent {
  protected nodeIds: string[];

  constructor(
    private configService: ConfigService,
    private copyNodesService: CopyNodesService,
    private insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(projectService, route, router);
    this.pathToProjectAuthoringView = '../..';
  }

  protected insertAfter(nodeId: string): Promise<any[]> {
    return this.importSelectedNodes(nodeId);
  }

  protected insertInside(groupNodeId: string): Promise<any[]> {
    return this.importSelectedNodes(groupNodeId);
  }

  protected importSelectedNodes(nodeIdToInsertInsideOrAfter: string): Promise<any[]> {
    return lastValueFrom(
      this.copyNodesService
        .copyNodes(
          history.state.selectedNodes,
          history.state.importFromProjectId,
          this.configService.getProjectId()
        )
        .pipe(
          map((copiedNodes: any[]): any[] => {
            const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
            this.insertNodesService.insertNodes(nodesWithNewNodeIds, nodeIdToInsertInsideOrAfter);
            return nodesWithNewNodeIds;
          })
        )
    );
  }
}
