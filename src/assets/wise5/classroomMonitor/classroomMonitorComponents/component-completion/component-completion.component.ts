import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
  selector: 'component-completion',
  template: `{{ this.numWorkgroupsCompleted }} ({{ completion | number: '1.0-0' }}%)`
})
export class ComponentCompletionComponent {
  protected completion: number;
  @Input() component: any;
  @Input() node: Node;
  @Input() periodId: number;
  protected workgroups: Map<number, any>;
  protected numWorkgroupsCompleted: number;

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: TeacherDataService,
    private workgroupService: WorkgroupService
  ) {}

  ngOnChanges(): void {
    if (this.component && this.node) {
      this.workgroups = this.workgroupService.getWorkgroupsInPeriod(this.periodId);
      this.numWorkgroupsCompleted = Array.from(this.workgroups.keys()).filter((workgroupId) =>
        this.isCompleted(workgroupId)
      ).length;
      this.completion = (this.numWorkgroupsCompleted / this.workgroups.size) * 100;
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
