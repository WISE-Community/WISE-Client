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
import { FlexLayoutModule } from '@angular/flex-layout';

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
  @Input() hasAlert: boolean;
  @Input() hasNewAlert: boolean;
  protected maxScore: number;
  @Input() nodeId: string;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  @Input() score: number | '-';
  @Input() status: any;
  statusClass: any;
  statusText: string = '';
  subscriptions: Subscription = new Subscription();
  @Input() workgroupId: number;
  @Input() workgroupData: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.setComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodeId || changes.componentId) {
      this.setComponent();
    }
    this.update();
  }

  private setComponent(): void {
    this.component = this.projectService.getComponent(this.nodeId, this.componentId);
    this.maxScore = this.projectService.getMaxScoreForComponent(this.nodeId, this.componentId) ?? 0;
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
    this.onUpdateExpand.emit({ workgroupId: this.workgroupId, value: !this.expanded });
  }
}
