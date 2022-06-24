import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TableStudent } from './table-student.component';

@NgModule({
  declarations: [TableStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [TableStudent]
})
export class TableStudentModule {}
