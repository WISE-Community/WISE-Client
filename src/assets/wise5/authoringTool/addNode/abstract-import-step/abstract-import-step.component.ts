import { Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Directive()
export abstract class AbstractImportStepComponent {
  constructor(
    protected configService: ConfigService,
    protected copyNodesService: CopyNodesService,
    protected insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  protected submit(
    nodesToImport: any[],
    importProjectId: number,
    nodeIdToInsertInsideOrAfter: string
  ): void {
    this.copyNodesService
      .copyNodes(nodesToImport, importProjectId, this.configService.getProjectId())
      .subscribe((copiedNodes: any[]) => {
        const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
        this.insertNodesService.insertNodes(nodesWithNewNodeIds, nodeIdToInsertInsideOrAfter);
        this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
          this.projectService.refreshProject();
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
      });
  }
}
