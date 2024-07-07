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
  standalone: true,
  styleUrl: './step-tools.component.scss',
  templateUrl: './step-tools.component.html'
})
export class StepToolsComponent implements OnInit {
  protected icons: any;
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
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
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
}
