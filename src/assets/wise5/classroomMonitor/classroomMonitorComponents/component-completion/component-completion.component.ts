import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

@Component({
  imports: [MatProgressBarModule, MatTooltipModule],
  selector: 'component-completion',
  templateUrl: 'component-completion.component.html'
})
export class ComponentCompletionComponent {
  protected completion: number;
  @Input() component: any;
  @Input() node: Node;
  protected numWorkgroupsCompleted: number;
  @Input() periodId: number;
  private subscriptions: Subscription = new Subscription();
  protected workgroups: Map<number, any>;

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: TeacherDataService,
    private statusService: ClassroomStatusService,
    private workgroupService: WorkgroupService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.statusService.studentStatusReceived$.subscribe(() => this.calculateCompletion())
    );
  }

  ngOnChanges(): void {
    this.calculateCompletion();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateCompletion(): void {
    if (this.component && this.node) {
      this.workgroups = new Map(
        Array.from(this.workgroupService.getWorkgroupsInPeriod(this.periodId)).filter(
          ([workgroupId]) =>
            this.statusService.hasStudentStatus(workgroupId) &&
            this.getComponentStatus(workgroupId)?.isVisible !== false
        )
      );
      this.numWorkgroupsCompleted = Array.from(this.workgroups.keys()).filter((workgroupId) =>
        this.isCompleted(workgroupId)
      ).length;
      this.completion =
        this.workgroups.size > 0
          ? Math.round((this.numWorkgroupsCompleted / this.workgroups.size) * 100)
          : 0;
    }
  }

  private getComponentStatus(workgroupId: number): any {
    return this.statusService.getStudentStatusForWorkgroupId(workgroupId)?.nodeStatuses?.[
      this.node.id
    ]?.componentStatuses?.[this.component.id];
  }

  private isCompleted(workgroupId: number): boolean {
    const componentStatus = this.getComponentStatus(workgroupId);
    if (componentStatus?.isCompleted != null) {
      return componentStatus.isCompleted;
    }
    const service = this.componentServiceLookupService.getService(this.component.type);
    const componentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      this.component.id
    );
    return ['OpenResponse', 'Discussion'].includes(this.component.type)
      ? service.isCompletedV2(this.node, this.component, {
          componentStates: componentStates
        })
      : service.isCompleted(
          this.component,
          componentStates,
          this.dataService.getEventsByNodeId(this.node.id),
          this.node
        );
  }
}
