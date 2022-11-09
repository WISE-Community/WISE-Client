import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TableCommonModule } from '../table-common.module';
import { TableStudent } from './table-student.component';

@NgModule({
  declarations: [TableStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule, TableCommonModule],
  exports: [TableStudent]
})
export class TableStudentModule {}
