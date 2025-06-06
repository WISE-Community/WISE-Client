import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/projectService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { ConfigService } from '../../../../app/services/config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'submit-survey',
  templateUrl: './submit-survey.component.html'
})
export class SubmitSurveyComponent {
  private genericSubmitWarning = $localize`Are you sure you want to submit your final responses?`;
  private logOutURL: string;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => (this.logOutURL = config.logOutURL));
  }

  protected submitSurvey(): void {
    const incompleteNodeIds: string[] = this.getIncompleteNodeIds();
    if (
      confirm(
        incompleteNodeIds.length > 0
          ? this.getIncompleteUnitSubmitWarning(incompleteNodeIds)
          : this.genericSubmitWarning
      )
    ) {
      this.logOut();
    }
  }

  private getIncompleteNodeIds(): string[] {
    return Object.keys(this.projectService.idToOrder).filter(
      (nodeId) =>
        this.projectService.isApplicationNode(nodeId) &&
        !this.nodeStatusService.getNodeStatusByNodeId(nodeId).isCompleted
    );
  }

  private getIncompleteUnitSubmitWarning(incompleteNodeIds: string[]): string {
    const incompleteNodePositions = incompleteNodeIds
      .map((nodeId) => this.projectService.getNodePositionById(nodeId))
      .reduce((acc, nodePos) => `${acc} ${nodePos},`, '')
      .slice(0, -1);
    return (
      $localize`You have not completed the following steps: ` +
      `${incompleteNodePositions}\n\n${this.genericSubmitWarning}`
    );
  }

  private logOut(): void {
    this.http.get(this.logOutURL).subscribe(() => (window.location.href = `/survey/completed`));
  }
}
