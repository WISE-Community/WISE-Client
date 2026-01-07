import { Component, Input, inject } from '@angular/core';
import { Node } from '../../../common/Node';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatProgressBarModule, MatTooltipModule],
  selector: 'component-completion',
  templateUrl: 'component-completion.component.html'
})
export class ComponentCompletionComponent {
  private componentServiceLookupService = inject(ComponentServiceLookupService);
  private dataService = inject(TeacherDataService);
  private statusService = inject(ClassroomStatusService);
  private workgroupService = inject(WorkgroupService);

  protected completion: number;
  @Input() component: any;
  @Input() node: Node;
  protected numWorkgroupsCompleted: number;
  @Input() periodId: number;
  protected workgroups: Map<number, any>;

  ngOnChanges(): void {
    if (this.component && this.node) {
      this.workgroups = new Map(
        Array.from(this.workgroupService.getWorkgroupsInPeriod(this.periodId)).filter(
          ([workgroupId]) => this.statusService.hasStudentStatus(workgroupId)
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

  private isCompleted(workgroupId: number): boolean {
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
