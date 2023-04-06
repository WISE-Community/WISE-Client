import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { calculateComponentVisibility } from '../../shared/grading-helpers/grading-helpers';

@Component({
  selector: 'workgroup-item',
  templateUrl: 'workgroup-item.component.html',
  styleUrls: ['workgroup-item.component.scss']
})
export class WorkgroupItemComponent {
  componentIdToHasWork: { [componentId: string]: boolean } = {};
  componentIdToIsVisible: { [componentId: string]: boolean } = {};
  components: any[] = [];
  disabled: boolean;
  @Input() expanded: boolean;
  hasAlert: boolean;
  hasNewAlert: boolean;
  @Input() hiddenComponents: string[] = [];
  @Input() maxScore: number;
  nodeHasWork: boolean;
  @Input() nodeId: string;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  score: any;
  @Input() showScore: boolean;
  status: any;
  statusClass: string;
  statusText: string = '';
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

  updateNode(): void {
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

  isComponentVisible(componentId: string): boolean {
    return !this.hiddenComponents.includes(componentId);
  }

  getComponentTypeLabel(componentType): string {
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

  toggleExpand(): void {
    if (this.showScore) {
      let expand = !this.expanded;
      this.onUpdateExpand.emit({ workgroupId: this.workgroupId, value: expand });
    }
  }
}
