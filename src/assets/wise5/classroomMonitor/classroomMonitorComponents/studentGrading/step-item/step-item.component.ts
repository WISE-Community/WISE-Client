import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { copy } from '../../../../common/object/object';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { calculateComponentVisibility } from '../../shared/grading-helpers/grading-helpers';

@Component({
  selector: 'step-item',
  templateUrl: './step-item.component.html',
  styleUrls: ['./step-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepItemComponent implements OnInit {
  componentIdToHasWork: { [componentId: string]: boolean } = {};
  componentIdToIsVisible: { [componentId: string]: boolean } = {};
  components: any[];
  disabled: boolean;
  @Input() expand: boolean;
  hasAlert: boolean;
  hasNewAlert: boolean;
  hasNewWork: boolean;
  @Input() inView: boolean;
  @Input() maxScore: number;
  @Input() nodeId: string;
  @Output() onUpdateExpand: any = new EventEmitter();
  score: any;
  @Input() showScore: boolean;
  status: any;
  statusClass: string;
  statusText: string = '';
  @Input() stepData: any;
  title: string;
  @Input() workgroupId: number;

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changesObj: SimpleChanges): void {
    if (changesObj.maxScore) {
      this.maxScore =
        typeof changesObj.maxScore.currentValue === 'number' ? changesObj.maxScore.currentValue : 0;
    }
    if (changesObj.stepData) {
      const stepData = copy(changesObj.stepData.currentValue);
      this.title = stepData.title;
      this.hasAlert = stepData.hasAlert;
      this.hasNewAlert = stepData.hasNewAlert;
      this.status = stepData.completionStatus;
      this.score = stepData.score >= 0 ? stepData.score : '-';
      this.components = this.projectService.getComponents(this.nodeId);
      this.componentIdToHasWork = this.projectService.calculateComponentIdToHasWork(
        this.components
      );
      this.componentIdToIsVisible = calculateComponentVisibility(
        this.componentIdToHasWork,
        stepData.nodeStatus.componentStatuses
      );
    }
    this.update();
  }

  update(): void {
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

  toggleExpand(): void {
    if (this.showScore) {
      const expand = !this.expand;
      this.onUpdateExpand.emit({ nodeId: this.nodeId, value: expand });
    }
  }

  getComponentTypeLabel(type: string): string {
    return this.componentServiceLookupService.getService(type).getComponentTypeLabel();
  }
}
