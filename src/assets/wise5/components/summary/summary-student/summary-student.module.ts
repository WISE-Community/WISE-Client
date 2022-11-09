import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { SummaryDisplayModule } from '../../../directives/summary-display/summary-display.module';
import { SummaryStudent } from './summary-student.component';

@NgModule({
  declarations: [SummaryStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule, SummaryDisplayModule],
  exports: [SummaryStudent]
})
export class SummaryStudentModule {}
