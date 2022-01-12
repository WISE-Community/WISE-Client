import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { SummaryDisplay } from './summary-display.component';

@NgModule({
  declarations: [SummaryDisplay],
  imports: [AngularJSModule, HighchartsChartModule, StudentComponentModule],
  exports: [SummaryDisplay]
})
export class SummaryDisplayModule {}
