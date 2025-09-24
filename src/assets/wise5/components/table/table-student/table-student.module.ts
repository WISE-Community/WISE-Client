import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TableStudentComponent } from './table-student.component';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';

@NgModule({
  declarations: [TableStudentComponent],
  imports: [StudentTeacherCommonModule, StudentComponentModule, TabulatorTableComponent],
  exports: [TableStudentComponent]
})
export class TableStudentModule {}
