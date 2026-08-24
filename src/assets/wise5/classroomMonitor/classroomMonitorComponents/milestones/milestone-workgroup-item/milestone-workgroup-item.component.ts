'use strict';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { copy } from '../../../../common/object/object';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { WorkgroupInfoComponent } from '../../nodeGrading/workgroupInfo/workgroup-info.component';
import { WorkgroupNodeStatusComponent } from '../../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupNodeScoreComponent } from '../../shared/workgroupNodeScore/workgroup-node-score.component';
import { MatListItem } from '@angular/material/list';
import { WorkgroupComponentGradingComponent } from '../../workgroup-component-grading/workgroup-component-grading.component';
import { ComponentInfoService } from '../../../../services/componentInfoService';
import { MatIcon } from '@angular/material/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    MatButton,
    MatIcon,
    WorkgroupInfoComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupNodeScoreComponent,
    MatListItem,
    WorkgroupComponentGradingComponent
  ],
  selector: 'milestone-workgroup-item',
  styleUrl: './milestone-workgroup-item.component.scss',
  templateUrl: './milestone-workgroup-item.component.html'
})
export class MilestoneWorkgroupItemComponent implements OnInit {
  changeInScore: number | '-';
  @Input() componentId: string;
  components: any[] = [];
  disabled: boolean;
  @Input() expanded: boolean;
  firstComponent: any;
  firstComponentId: string;
  firstNodeId: string;
  firstComponentMaxScore: number;
  hasAlert: boolean;
  hasNewAlert: boolean;
  initialScore: number | '-';
  lastComponent: any;
  lastComponentId: string;
  lastNodeId: string;
  lastComponentMaxScore: number;
  @Input() locations: any[];
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  score: number | '-';
  @Input() showScore: boolean;
  status: any;
  statusClass: any;
  statusText: string = '';
  subscriptions: Subscription = new Subscription();
  @Input() workgroupId: number;
  @Input() workgroupData: any;

  constructor(
    protected componentInfoService: ComponentInfoService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.initLastLocation();
    if (this.locations.length > 1) {
      this.initFirstLocation();
    }
    this.subscribeToProjectChanges();
    this.update();
  }

  private initLastLocation(): void {
    const lastLocation = this.locations[this.locations.length - 1];
    this.lastNodeId = lastLocation.nodeId;
    this.lastComponentId = lastLocation.componentId;
    this.lastComponent = this.projectService.getComponent(this.lastNodeId, this.lastComponentId);
    this.setLastComponentMaxScore();
  }

  private initFirstLocation(): void {
    const firstLocation = this.locations[0];
    this.firstComponentId = firstLocation.componentId;
    this.firstNodeId = firstLocation.nodeId;
    this.firstComponent = this.projectService.getComponent(this.firstNodeId, this.firstComponentId);
    this.setFirstComponentMaxScore();
  }

  private subscribeToProjectChanges(): void {
    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => {
        this.setLastComponentMaxScore();
        if (this.locations.length > 1) {
          this.setFirstComponentMaxScore();
        }
      })
    );
  }

  private setFirstComponentMaxScore(): void {
    this.firstComponentMaxScore = this.projectService.getMaxScoreForComponent(
      this.firstNodeId,
      this.firstComponentId
    );
  }

  private setLastComponentMaxScore(): void {
    this.lastComponentMaxScore = this.projectService.getMaxScoreForComponent(
      this.lastNodeId,
      this.lastComponentId
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workgroupData) {
      const workgroupData = copy(changes.workgroupData.currentValue);
      this.hasAlert = workgroupData.hasAlert;
      this.hasNewAlert = workgroupData.hasNewAlert;
      this.status = workgroupData.completionStatus;
      this.score = workgroupData.score != null ? workgroupData.score : '-';
      this.initialScore = workgroupData.initialScore != null ? workgroupData.initialScore : '-';
      this.changeInScore =
        workgroupData.score != null && workgroupData.initialScore != null
          ? workgroupData.score - workgroupData.initialScore
          : '-';
    }
    this.update();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getComponentTypeIcon(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getIcon();
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getLabel();
  }

  getNodePosition(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  private update(): void {
    switch (this.status) {
      case -1:
        this.statusClass = ' ';
        this.statusText = $localize`Not Assigned`;
        break;
      case 2:
        this.statusClass = 'success';
        this.statusText = $localize`Completed`;
        break;
      case 1:
        this.statusClass = 'text';
        this.statusText = $localize`Partially Completed`;
        break;
      default:
        this.statusClass = 'text-secondary';
        if (this.componentId) {
          this.statusText = $localize`Not Completed`;
        } else {
          this.statusText = $localize`No Work`;
        }
    }
    if (this.hasNewAlert) {
      this.statusClass = 'warn';
    }
    this.disabled = this.status === -1;
  }

  toggleExpand(): void {
    if (this.showScore) {
      this.onUpdateExpand.emit({ workgroupId: this.workgroupId, value: !this.expanded });
    }
  }
}
