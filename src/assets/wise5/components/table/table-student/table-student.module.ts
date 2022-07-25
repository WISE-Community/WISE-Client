import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';
import { TableStudent } from './table-student.component';

@NgModule({
  declarations: [TableStudent, TabulatorTableComponent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [TableStudent, TabulatorTableComponent]
})
export class TableStudentModule {}
