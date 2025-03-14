import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
  selector: 'component-completion',
  template: `{{ completion | number: '1.0-0' }}%`
})
export class ComponentCompletionComponent {
  protected completion: number;
  @Input() component: any;
  @Input() node: Node;
  @Input() periodId: number;

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: TeacherDataService,
    private workgroupService: WorkgroupService
  ) {}

  ngOnChanges(): void {
    if (this.component && this.node) {
      const workgroups = this.workgroupService.getWorkgroupsInPeriod(this.periodId);
      const numWorkgroupsCompleted = Array.from(workgroups.keys()).filter((workgroupId) =>
        this.isCompleted(workgroupId)
      ).length;
      this.completion = (numWorkgroupsCompleted / workgroups.size) * 100;
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
