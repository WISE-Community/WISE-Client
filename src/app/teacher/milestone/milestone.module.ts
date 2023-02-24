import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HighchartsChartModule } from 'highcharts-angular';
import { MilestoneDetailsDialogComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details-dialog/milestone-details-dialog.component';
import { MilestoneDetailsComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details/milestone-details.component';
import { MilestoneGradingViewComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-grading-view/milestone-grading-view.component';
import { MilestoneWorkgroupItemComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-workgroup-item/milestone-workgroup-item.component';
import { MilestonesComponent } from '../../classroom-monitor/milestones/milestones.component';
import { StudentTeacherCommonModule } from '../../student-teacher-common.module';
import { GradingCommonModule } from '../grading-common.module';
import { SelectPeriodModule } from '../select-period.module';
import { MilestoneReportDataComponent } from './milestone-report-data/milestone-report-data.component';
import { MilestoneReportGraphComponent } from './milestone-report-graph/milestone-report-graph.component';

@NgModule({
  imports: [
    GradingCommonModule,
    HighchartsChartModule,
    SelectPeriodModule,
    StudentTeacherCommonModule
  ],
  declarations: [
    MilestonesComponent,
    MilestoneDetailsComponent,
    MilestoneDetailsDialogComponent,
    MilestoneGradingViewComponent,
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
