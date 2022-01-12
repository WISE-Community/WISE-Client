import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { SummaryDisplayModule } from '../../../directives/summaryDisplay/summary-display.module';
import { SummaryStudent } from './summary-student.component';

@NgModule({
  declarations: [SummaryStudent],
  imports: [AngularJSModule, StudentComponentModule, SummaryDisplayModule],
  exports: [SummaryStudent]
})
export class SummaryStudentModule {}
