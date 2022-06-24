import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { TableShowWorkComponent } from './table-show-work.component';

@NgModule({
  declarations: [TableShowWorkComponent],
  imports: [StudentTeacherCommonModule],
  exports: [TableShowWorkComponent]
})
export class TableShowWorkModule {}
