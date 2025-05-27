import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NodeIconComponent } from '../../../../vle/node-icon/node-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NodeStatusIconComponent } from '../nodeStatusIcon/node-status-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StudentService } from '../../../../../../app/student/student.service';
import { ConfigService } from '../../../../services/configService';
import { LogOutService } from '../../../../../../app/services/logOutService';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NodeIconComponent,
    NodeStatusIconComponent
  ],
  selector: 'step-tools',
  styleUrl: './step-tools.component.scss',
  templateUrl: './step-tools.component.html'
})
export class StepToolsComponent implements OnInit {
  private genericSubmitWarning = $localize`Are you sure you want to submit?\n\nIf you submit, you will not be able to continue working on this unit.`;
  protected icons: any;
  protected isSurvey: boolean;
  protected is_rtl: boolean;
  protected nextId: string;
  protected nodeId: string;
  protected nodeIds: string[];
  protected nodeStatus: any;
  protected nodeStatuses: any;
  protected prevId: string;
  private subscriptions: Subscription = new Subscription();
  protected toNodeId: string;

  constructor(
    private configService: ConfigService,
    private logOutService: LogOutService,
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.calculateNodeIds();
    this.nodeStatuses = this.nodeStatusService.getNodeStatuses();
    this.updateModel();
    this.setIsSurvey();
    this.subscribeToChanges();
  }

  private subscribeToChanges(): void {
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.updateModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected toNodeIdChanged(): void {
    this.nodeService.setCurrentNode(this.toNodeId);
  }

  private updateModel(): void {
    const nodeId = this.studentDataService.getCurrentNodeId();
    if (!this.projectService.isGroupNode(nodeId)) {
      this.nodeId = nodeId;
      this.nodeStatus = this.nodeStatuses[this.nodeId];
      this.prevId = this.nodeService.getPrevNodeId();
      this.nextId = null;
      this.nodeService.getNextNodeId().then((nodeId: string) => {
        this.nextId = nodeId;
      });
      this.toNodeId = this.nodeId;
    }
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected goToPrevNode(): void {
    this.nodeService.goToPrevNode();
  }

  protected goToNextNode(): void {
    this.nodeService.goToNextNode();
  }

  protected closeNode(): void {
    this.nodeService.closeNode();
  }

  private setIsSurvey(): void {
    if (!this.configService.isPreview()) {
      this.studentService
        .getRunInfoById(this.studentDataService.getRunStatus().runId)
        .subscribe((runInfo) => {
          this.isSurvey = runInfo.isSurvey !== undefined ? runInfo.isSurvey : false;
        });
    }
  }

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
    const studentData = await this.studentDataService.retrieveStudentData();
    const projectNodes = this.projectService.getProject().nodes;
    const unfinishedNodes: Set<string> = new Set<string>();

    projectNodes
      .filter((node) => node.type === 'node')
      .forEach((node) => {
        node.components
          .filter((component) => component.type !== 'HTML')
          .forEach((component) => {
            if (
              !studentData.componentStates.some(
                (componentState) => componentState.componentId === component.id
              )
            ) {
              unfinishedNodes.add(node.id);
            }
          });
      });

    return Array.from(unfinishedNodes);
  }

  private getSpecificWarning(unfinishedNodes: string[]): string {
    const unfinishedStepPositions = unfinishedNodes
      .map((nodeId) => this.projectService.getNodePositionById(nodeId))
      .sort(this.sortByPosition)
      .reduce((acc, nodePos) => `${acc} ${nodePos}, `, '')
      .slice(0, -2);
    return (
      $localize`You have not completed the following steps: ` +
      `${unfinishedStepPositions}\n\n${this.genericSubmitWarning}`
    );
  }

  private sortByPosition(node1: string, node2: string): number {
    const node1PeriodIndex = node1.indexOf('.');
    const node2PeriodIndex = node2.indexOf('.');
    const node1Prefix = node1.slice(0, node1PeriodIndex);
    const node2Prefix = node2.slice(0, node2PeriodIndex);

    if (node1Prefix === node2Prefix) {
      const node1Suffix = node1.slice(node1PeriodIndex + 1);
      const node2Suffix = node2.slice(node2PeriodIndex + 1);
      return Number(node1Suffix) - Number(node2Suffix);
    } else {
      return Number(node1Prefix) - Number(node2Prefix);
    }
  }
}
