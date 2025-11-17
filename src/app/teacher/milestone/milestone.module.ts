import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MilestoneDetailsDialogComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details-dialog/milestone-details-dialog.component';
import { MilestoneDetailsComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details/milestone-details.component';
import { MilestoneClassResponsesComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-class-responses/milestone-class-responses.component';
import { MilestoneWorkgroupItemComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-workgroup-item/milestone-workgroup-item.component';
import { MilestonesComponent } from '../../classroom-monitor/milestones/milestones.component';
import { MilestoneReportDataComponent } from './milestone-report-data/milestone-report-data.component';
import { MilestoneReportGraphComponent } from './milestone-report-graph/milestone-report-graph.component';
import { SelectPeriodComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';

@NgModule({
  imports: [
    SelectPeriodComponent,
    MilestonesComponent,
    MilestoneDetailsComponent,
    MilestoneDetailsDialogComponent,
    MilestoneClassResponsesComponent,
    MilestoneReportDataComponent,
    MilestoneReportGraphComponent,
    MilestoneWorkgroupItemComponent
  ],
  exports: [MilestonesComponent]
})
export class MilestoneModule {
  constructor(private injector: Injector) {
    if (!customElements.get('milestone-report-data')) {
      customElements.define(
        'milestone-report-data',
        createCustomElement(MilestoneReportDataComponent, { injector: this.injector })
      );
    }
    if (!customElements.get('milestone-report-graph')) {
      customElements.define(
        'milestone-report-graph',
        createCustomElement(MilestoneReportGraphComponent, { injector: this.injector })
      );
    }
  }
}
