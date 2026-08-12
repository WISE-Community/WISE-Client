import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { calculateComponentVisibility } from '../../shared/grading-helpers/grading-helpers';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { WorkgroupComponentGradingComponent } from '../../workgroup-component-grading/workgroup-component-grading.component';
import { ComponentNewWorkBadgeComponent } from '../../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { WorkgroupNodeScoreComponent } from '../../shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupNodeStatusComponent } from '../../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupInfoComponent } from '../workgroupInfo/workgroup-info.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Node } from '../../../../common/Node';
import { ComponentContent } from '../../../../common/ComponentContent';
import { filter, Subscription } from 'rxjs';
import { AnnotationService } from '../../../../services/annotationService';
import { ComponentInfoService } from '../../../../services/componentInfoService';
import { MatIconModule } from '@angular/material/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    WorkgroupInfoComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupNodeScoreComponent,
    ComponentNewWorkBadgeComponent,
    WorkgroupComponentGradingComponent
  ],
  selector: 'node-workgroup-item',
  styleUrl: './node-workgroup-item.component.scss',
  templateUrl: './node-workgroup-item.component.html'
})
export class NodeWorkgroupItemComponent {
  private componentIdToHasWork: { [componentId: string]: boolean } = {};
  protected componentIdToIsVisible: { [componentId: string]: boolean } = {};
  @Input() components: ComponentContent[] = [];
  protected disabled: boolean;
  @Input() expanded: boolean;
  protected hasAlert: boolean;
  protected hasNewAlert: boolean;
  @Input() maxScore: number;
  private nodeHasWork: boolean;
  @Input() node: Node;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  protected score: any;
  private status: any;
  protected statusClass: string;
  protected statusText: string = '';
  private subscriptions: Subscription = new Subscription();
  @Input() workgroup: any;

  constructor(
    private annotationService: AnnotationService,
    private componentInfoService: ComponentInfoService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.updateNode();
    this.updateStatus();
    this.subscribeToAnnotations();
  }

  private subscribeToAnnotations(): void {
    this.subscriptions.add(
      this.annotationService.annotationReceived$
        .pipe(
          filter(
            (annotation) =>
              annotation.nodeId === this.node.id &&
              annotation.toWorkgroupId === this.workgroup.workgroupId
          )
        )
        .subscribe(
          () =>
            (this.score = this.annotationService.getTotalNodeScore(
              this.workgroup.workgroupId,
              this.node,
              this.components
            ))
        )
    );
  }

  private updateNode(): void {
    this.nodeHasWork = this.projectService.nodeHasWork(this.node.id);
    this.componentIdToHasWork = this.projectService.calculateComponentIdToHasWork(this.components);
    this.componentIdToIsVisible = calculateComponentVisibility(
      this.componentIdToHasWork,
      this.workgroup.nodeStatus.componentStatuses
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workgroup) {
      const workgroup = changes.workgroup.currentValue;
      this.hasAlert = workgroup.hasAlert;
      this.hasNewAlert = workgroup.hasNewAlert;
      this.status = workgroup.completionStatus;
      this.score = workgroup.score != null ? workgroup.score : '-';
      this.workgroup = workgroup;
      this.updateNode();
      this.updateStatus();
    }
    if (changes.nodeId) {
      this.updateNode();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected getComponentTypeIcon(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getIcon();
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getLabel();
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
    this.onUpdateExpand.emit({ workgroupId: this.workgroup.workgroupId, value: !this.expanded });
  }
}
