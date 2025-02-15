import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { WorkgroupInfoComponent } from '../nodeGrading/workgroupInfo/workgroup-info.component';
import { MatListItem } from '@angular/material/list';
import { ComponentNewWorkBadgeComponent } from '../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { WorkgroupComponentGradingComponent } from '../workgroup-component-grading/workgroup-component-grading.component';
import { Subscription } from 'rxjs';
import { WorkgroupNodeStatusComponent } from '../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupNodeScoreComponent } from '../shared/workgroupNodeScore/workgroup-node-score.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { copy } from '../../../common/object/object';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AnnotationService } from '../../../services/annotationService';

@Component({
  imports: [
    CommonModule,
    ComponentNewWorkBadgeComponent,
    FlexLayoutModule,
    MatListItem,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent
  ],
  selector: 'component-workgroup-item',
  standalone: true,
  styleUrl: './component-workgroup-item.component.scss',
  templateUrl: './component-workgroup-item.component.html'
})
export class ComponentWorkgroupItemComponent {
  @Input() componentId: string;
  component: any;
  disabled: boolean;
  @Input() expanded: boolean;
  hasAlert: boolean;
  hasNewAlert: boolean;
  protected maxScore: number;
  @Input() nodeId: string;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  protected score: number | '-';
  @Input() showScore: boolean;
  status: any;
  statusClass: any;
  statusText: string = '';
  subscriptions: Subscription = new Subscription();
  @Input() workgroupId: number;
  @Input() workgroupData: any;

  constructor(
    private annotationService: AnnotationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workgroupData) {
      const workgroupData = copy(changes.workgroupData.currentValue);
      this.hasAlert = workgroupData.hasAlert;
      this.hasNewAlert = workgroupData.hasNewAlert;
      this.status = workgroupData.completionStatus;
      this.score = workgroupData.score != null ? workgroupData.score : '-';
    } else if (changes.nodeId || changes.componentId) {
      this.setComponent();
    }
    this.update();
  }

  private setComponent(): void {
    this.component = this.projectService.getComponent(this.nodeId, this.componentId);
    this.maxScore = this.projectService.getMaxScoreForComponent(this.nodeId, this.componentId) ?? 0;
    this.score =
      this.annotationService.getLatestScoreAnnotation(
        this.nodeId,
        this.componentId,
        this.workgroupId
      )?.data.value ?? '-';
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

  protected toggleExpand(): void {
    if (this.showScore) {
      this.onUpdateExpand.emit({ workgroupId: this.workgroupId, value: !this.expanded });
    }
  }
}
