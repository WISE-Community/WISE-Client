import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { GraphStudent } from './graph-student.component';

@NgModule({
  declarations: [GraphStudent],
  imports: [AngularJSModule, HighchartsChartModule, StudentComponentModule],
  exports: [GraphStudent]
})
export class GraphStudentModule {}
