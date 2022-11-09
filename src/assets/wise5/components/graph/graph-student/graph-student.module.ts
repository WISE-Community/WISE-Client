import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { GraphStudent } from './graph-student.component';

@NgModule({
  declarations: [GraphStudent],
  imports: [StudentTeacherCommonModule, HighchartsChartModule, StudentComponentModule],
  exports: [GraphStudent]
})
export class GraphStudentModule {}
