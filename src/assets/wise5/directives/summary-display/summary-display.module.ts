import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { StudentSummaryDisplay } from '../student-summary-display/student-summary-display.component';

@NgModule({
  declarations: [StudentSummaryDisplay],
  imports: [StudentTeacherCommonModule, HighchartsChartModule, StudentComponentModule],
  exports: [StudentSummaryDisplay]
})
export class SummaryDisplayModule {}
