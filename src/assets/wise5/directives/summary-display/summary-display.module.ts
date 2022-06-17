import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { StudentSummaryDisplay } from '../student-summary-display/student-summary-display.component';

@NgModule({
  declarations: [StudentSummaryDisplay],
  imports: [AngularJSModule, HighchartsChartModule, StudentComponentModule],
  exports: [StudentSummaryDisplay]
})
export class SummaryDisplayModule {}
