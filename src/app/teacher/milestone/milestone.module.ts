import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { MilestoneReportGraphComponent } from './milestone-report-graph/milestone-report-graph.component';

@NgModule({
  imports: [CommonModule, HighchartsChartModule],
  declarations: [MilestoneReportGraphComponent],
  exports: [MilestoneReportGraphComponent]
})
export class MilestoneModule {}
