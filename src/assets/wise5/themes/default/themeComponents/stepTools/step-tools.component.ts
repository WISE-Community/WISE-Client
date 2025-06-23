import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NodeIconComponent } from '../../../../vle/node-icon/node-icon.component';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusIconComponent } from '../nodeStatusIcon/node-status-icon.component';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { Subscription } from 'rxjs';
import { TimedNodeService } from '../../../../services/timedNodeService';

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
  protected icons: any;
  protected isSurvey: boolean;
  protected is_rtl: boolean;
  protected nextId: string;
  protected nodeId: string;
  protected nodeIds: string[];
  protected nodeStatus: any;
  protected nodeStatuses: any;
  protected prevId: string;
  @Input() private timedStep: boolean;
  protected timedStepCompleted: boolean;
  private subscriptions: Subscription = new Subscription();
  protected toNodeId: string;

  constructor(
    protected nodeService: NodeService,
    protected nodeStatusService: NodeStatusService,
    protected projectService: ProjectService,
    protected studentDataService: StudentDataService,
    private timedNodeService: TimedNodeService
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
    this.subscriptions.add(
      this.timedNodeService.isNodeCompletedBroadcast.subscribe(
        (isStepCompleted) => (this.timedStepCompleted = isStepCompleted)
      )
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

  protected isArrowDisabled(direction: 'prev' | 'next'): boolean {
    const noNode = direction === 'prev' ? !this.prevId : !this.nextId;
    return noNode || this.isUnfinishedTimedStep();
  }

  protected isUnfinishedTimedStep(): boolean {
    if (this.timedStep) {
      return !this.timedStepCompleted;
    } else {
      return false;
    }
  }
}
