import { Injectable } from '@angular/core';
import { NodeService } from './nodeService';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../app/services/data.service';
import { ConfigService } from './configService';
import { ConstraintService } from './constraintService';
import { ProjectService } from './projectService';
import { NodeStatusService } from './nodeStatusService';

@Injectable()
export class StudentNodeService extends NodeService {
  constructor(
    protected dialog: MatDialog,
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    private nodeStatusService: NodeStatusService,
    protected projectService: ProjectService,
    protected dataService: DataService
  ) {
    super(dialog, configService, constraintService, projectService, dataService);
  }

  setCurrentNode(nodeId: string): void {
    if (this.nodeStatusService.getNodeStatusByNodeId(nodeId).isVisitable) {
      this.dataService.setCurrentNodeByNodeId(nodeId);
    } else {
      this.dataService.nodeClickLocked(nodeId);
    }
  }
}
