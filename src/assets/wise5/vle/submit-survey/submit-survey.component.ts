import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { LogOutService } from '../../../../app/services/logOutService';

@Component({
  selector: 'submit-survey',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './submit-survey.component.html'
})
export class SubmitSurveyComponent {
  private genericSubmitWarning = $localize`Are you sure you want to submit your final answers?\nIf you do, you will not be able to continue working on this unit.`;

  constructor(
    private configService: ConfigService,
    private logOutService: LogOutService,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService
  ) {}

  protected async submitSurvey(): Promise<void> {
    const unfinishedNodes: string[] = await this.getUnfinishedNodes();
    if (
      confirm(
        unfinishedNodes.length > 0
          ? this.getSpecificWarning(unfinishedNodes)
          : this.genericSubmitWarning
      )
    ) {
      this.logOutService.logOut();
      window.location.href = `${this.configService.getContextPath()}/survey/completed`;
    }
  }

  private async getUnfinishedNodes(): Promise<string[]> {
    const nodeIds = Object.keys(this.projectService.idToOrder);
    const unfinishedNodes: Set<string> = new Set<string>();
    nodeIds
      .filter((nodeId) => this.projectService.getNode(nodeId).type === 'node')
      .forEach((nodeId) => {
        const status = this.nodeStatusService.getNodeStatusByNodeId(nodeId);
        if (!status.isCompleted) {
          unfinishedNodes.add(nodeId);
        }
      });
    return Array.from(unfinishedNodes);
  }

  private getSpecificWarning(unfinishedNodes: string[]): string {
    const unfinishedStepPositions = unfinishedNodes
      .map((nodeId) => this.projectService.getNodePositionById(nodeId))
      .reduce((acc, nodePos) => `${acc} ${nodePos},`, '')
      .slice(0, -1);
    return (
      $localize`You have not completed the following steps: ` +
      `${unfinishedStepPositions}\n\n${this.genericSubmitWarning}`
    );
  }
}
