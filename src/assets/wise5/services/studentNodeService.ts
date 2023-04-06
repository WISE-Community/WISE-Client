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
    dialog: MatDialog,
    configService: ConfigService,
    constraintService: ConstraintService,
    private nodeStatusService: NodeStatusService,
    projectService: ProjectService,
    dataService: DataService
  ) {
    super(dialog, configService, constraintService, projectService, dataService);
  }

  setCurrentNode(nodeId: string): void {
    if (this.nodeStatusService.getNodeStatusByNodeId(nodeId).isVisitable) {
      this.DataService.setCurrentNodeByNodeId(nodeId);
    } else {
      this.DataService.nodeClickLocked(nodeId);
    }
  }
}
