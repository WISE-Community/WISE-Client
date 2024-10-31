import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TableCommonModule } from '../table-common.module';
import { TableStudentComponent } from './table-student.component';

@NgModule({
  declarations: [TableStudentComponent],
  imports: [StudentTeacherCommonModule, StudentComponentModule, TableCommonModule],
  exports: [TableStudentComponent]
})
export class TableStudentModule {}
