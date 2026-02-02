import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { copy } from '../../../../common/object/object';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { calculateComponentVisibility } from '../../shared/grading-helpers/grading-helpers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { StepInfoComponent } from '../../../../../../app/classroom-monitor/step-info/step-info.component';
import { ComponentNewWorkBadgeComponent } from '../../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { WorkgroupNodeStatusComponent } from '../../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupNodeScoreComponent } from '../../shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupComponentGradingComponent } from '../../workgroup-component-grading/workgroup-component-grading.component';

@Component({
  imports: [
    CommonModule,
    ComponentNewWorkBadgeComponent,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    StepInfoComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupNodeScoreComponent
  ],
  selector: 'step-item',
  templateUrl: './step-item.component.html',
  styleUrl: './step-item.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StepItemComponent {
  private componentServiceLookupService = inject(ComponentServiceLookupService);
  private projectService = inject(TeacherProjectService);

  protected componentIdToIsVisible: { [componentId: string]: boolean } = {};
  protected components: any[];
  protected disabled: boolean;
  @Input() expand: boolean;
  protected hasAlert: boolean;
  protected hasNewAlert: boolean;
  protected hasNewWork: boolean;
  @Input() inView: boolean;
  @Input() maxScore: number;
  @Input() nodeId: string;
  @Output() onUpdateExpand: any = new EventEmitter();
  @Input() score: any;
  @Input() showScore: boolean;
  private status: any;
  protected statusClass: string;
  protected statusText: string = '';
  @Input() stepData: any;
  @Input() workgroupId: number;

  ngOnChanges(changesObj: SimpleChanges): void {
    if (changesObj.maxScore) {
      this.maxScore =
        typeof changesObj.maxScore.currentValue === 'number' ? changesObj.maxScore.currentValue : 0;
    }
    if (changesObj.score) {
      this.score = changesObj.score.currentValue >= 0 ? changesObj.score.currentValue : '-';
    }
    if (changesObj.stepData) {
      const stepData = copy(changesObj.stepData.currentValue);
      this.hasAlert = stepData.hasAlert;
      this.hasNewAlert = stepData.hasNewAlert;
      this.status = stepData.completionStatus;
      this.components = this.projectService.getComponents(this.nodeId);
      this.componentIdToIsVisible = calculateComponentVisibility(
        this.projectService.calculateComponentIdToHasWork(this.components),
        stepData.nodeStatus.componentStatuses
      );
    }
    this.update();
  }

  private update(): void {
    switch (this.status) {
      case -1:
        this.statusClass = ' ';
        this.statusText = $localize`Not Assigned`;
        break;
      case 2:
        this.statusClass = 'success';
        if (this.showScore) {
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
        if (this.showScore) {
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
      const expand = !this.expand;
      this.onUpdateExpand.emit({ nodeId: this.nodeId, value: expand });
    }
  }

  protected getComponentTypeLabel(type: string): string {
    return this.componentServiceLookupService.getService(type).getComponentTypeLabel();
  }
}
