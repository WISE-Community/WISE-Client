import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { NodeIconComponent } from '../../../../vle/node-icon/node-icon.component';
import { NodeStatusIconComponent } from '../nodeStatusIcon/node-status-icon.component';

export interface StepItem {
  id: string;
  title: string;
}

export interface GroupItem {
  id: string;
  title: string;
  children: StepItem[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NodeIconComponent,
    NodeStatusIconComponent
  ],
  selector: 'step-select',
  styleUrl: './step-select.component.scss',
  templateUrl: './step-select.component.html'
})
export class StepSelectComponent implements OnInit, OnDestroy {
  protected currentNodeTitle: string;
  protected expandedGroups: { [groupId: string]: boolean } = {};
  protected groups: GroupItem[] = [];
  protected nodeId: string;
  protected nodeStatuses: any;
  protected rootNodeId: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.calculateGroups();
    this.nodeStatuses = this.nodeStatusService.getNodeStatuses();
    this.updateModel();
    this.setExpandedGroup();
    this.subscribeToChanges();
  }

  private subscribeToChanges(): void {
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
        this.expandedGroups = {};
        this.setExpandedGroup();
      })
    );
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.nodeStatuses = this.nodeStatusService.getNodeStatuses();
        this.updateModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateGroups(): void {
    const nodeIds = Object.keys(this.projectService.idToOrder);
    this.rootNodeId = nodeIds[0];
    this.groups = nodeIds
      .slice(1)
      .filter((id) => this.projectService.isGroupNode(id))
      .map((groupId) => ({
        id: groupId,
        title: this.projectService.getNodePositionAndTitle(groupId),
        children: (this.projectService.getChildNodeIdsById(groupId) || []).map((childId) => ({
          id: childId,
          title: this.projectService.getNodePositionAndTitle(childId)
        }))
      }));
  }

  private updateModel(): void {
    const nodeId = this.studentDataService.getCurrentNodeId();
    if (!this.projectService.isGroupNode(nodeId)) {
      this.nodeId = nodeId;
      this.currentNodeTitle = this.projectService.getNodePositionAndTitle(this.nodeId);
    }
  }

  protected onMenuOpened(): void {
    this.setExpandedGroup();
    setTimeout(() => {
      this.focusAndScrollToActiveItem();
    });
  }

  private focusAndScrollToActiveItem(): void {
    const activeItem = document.querySelector<HTMLElement>('.mdc-list-item--activated');
    if (activeItem) {
      activeItem.focus({ preventScroll: true });
      activeItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  protected setExpandedGroup(): void {
    this.expandedGroups[this.projectService.getParentGroupId(this.nodeId)] = true;
  }

  protected chooseNode(nodeId: string): void {
    this.nodeService.setCurrentNode(nodeId);
  }

  protected getProgressTooltip(groupId: string): string {
    const progress = this.nodeStatuses[groupId]?.progress;
    return progress
      ? $localize`${progress.completionPct}% completed (${progress.completedItems}/${progress.totalItems} steps)`
      : '';
  }
}
