import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { calculateComponentVisibility } from '../../shared/grading-helpers/grading-helpers';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkgroupInfoComponent } from '../workgroupInfo/workgroup-info.component';
import { WorkgroupNodeStatusComponent } from '../../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupNodeScoreComponent } from '../../shared/workgroupNodeScore/workgroup-node-score.component';
import { ComponentNewWorkBadgeComponent } from '../../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { WorkgroupComponentGradingComponent } from '../../workgroup-component-grading/workgroup-component-grading.component';

@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatListModule,
        FlexLayoutModule,
        WorkgroupInfoComponent,
        WorkgroupNodeStatusComponent,
        WorkgroupNodeScoreComponent,
        ComponentNewWorkBadgeComponent,
        WorkgroupComponentGradingComponent
    ],
    selector: 'workgroup-item',
    styleUrl: 'workgroup-item.component.scss',
    templateUrl: 'workgroup-item.component.html'
})
export class WorkgroupItemComponent {
  private componentIdToHasWork: { [componentId: string]: boolean } = {};
  protected componentIdToIsVisible: { [componentId: string]: boolean } = {};
  protected components: any[] = [];
  protected disabled: boolean;
  @Input() expanded: boolean;
  protected hasAlert: boolean;
  protected hasNewAlert: boolean;
  @Input() maxScore: number;
  private nodeHasWork: boolean;
  @Input() nodeId: string;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  protected score: any;
  @Input() showScore: boolean;
  private status: any;
  protected statusClass: string;
  protected statusText: string = '';
  @Input() workgroupId: number;
  @Input() workgroupData: any;

  constructor(
    protected componentTypeService: ComponentTypeService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.updateNode();
    this.updateStatus();
  }

  private updateNode(): void {
    this.nodeHasWork = this.projectService.nodeHasWork(this.nodeId);
    this.components = this.projectService.getComponents(this.nodeId);
    this.componentIdToHasWork = this.projectService.calculateComponentIdToHasWork(this.components);
    this.componentIdToIsVisible = calculateComponentVisibility(
      this.componentIdToHasWork,
      this.workgroupData.nodeStatus.componentStatuses
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maxScore) {
      this.maxScore =
        typeof changes.maxScore.currentValue === 'number' ? changes.maxScore.currentValue : 0;
    }
    if (changes.workgroupData) {
      const workgroupData = changes.workgroupData.currentValue;
      this.hasAlert = workgroupData.hasAlert;
      this.hasNewAlert = workgroupData.hasNewAlert;
      this.status = workgroupData.completionStatus;
      this.score = workgroupData.score != null ? workgroupData.score : '-';
      this.workgroupData = workgroupData;
      this.updateNode();
      this.updateStatus();
    }
    if (changes.nodeId) {
      this.updateNode();
    }
  }

  protected getComponentTypeLabel(componentType): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  private updateStatus(): void {
    switch (this.status) {
      case -1:
        this.statusClass = ' ';
        this.statusText = $localize`Not Assigned`;
        break;
      case 2:
        this.statusClass = 'success';
        if (this.nodeHasWork) {
          this.statusText = $localize`Completed`;
        } else {
          this.statusText = $localize`Visited`;
        }
        break;
      case 1:
        this.statusClass = 'text';
        this.statusText = $localize`Partially Completed`;
        break;
      default:
        this.statusClass = 'text-secondary';
        if (this.nodeHasWork) {
          this.statusText = $localize`No Work`;
        } else {
          this.statusText = $localize`Not Visited`;
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
